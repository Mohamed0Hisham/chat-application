import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { io, Socket, ManagerOptions, SocketOptions } from "socket.io-client";

interface UseSocketOptions {
	socketOptions?: Partial<ManagerOptions & SocketOptions>; // Socket.IO-specific options
	maxRetries?: number; // Max reconnection attempts
	onConnect?: () => void;
	onDisconnect?: () => void;
	onError?: (error: Error) => void;
	onMaxRetriesExceeded?: () => void; // Callback when retries are exhausted
	onMessage?: (event: string, data: unknown) => void;
	eventNames?: string[]; // Custom events to listen to
	immediate?: boolean; // Connect immediately on mount
	exposeSocket?: boolean; // Whether to expose the socket instance
}

interface UseSocketReturn {
	isConnected: boolean;
	sendMessage: (event: string, data: unknown) => void;
	connect: () => void;
	disconnect: () => void;
	socket?: Socket | null; // Exposed conditionally
}

export function useSocket(
	url: string,
	options: UseSocketOptions = {}
): UseSocketReturn {
	const {
		socketOptions = {},
		maxRetries = Infinity,
		onConnect,
		onError,
		onMaxRetriesExceeded,
		onMessage,
		eventNames = [],
		immediate = true,
		exposeSocket = false,
	} = options;

	const [isConnected, setIsConnected] = useState(false);
	const socketRef = useRef<Socket | null>(null);
	const retryCountRef = useRef(0);
	const isManuallyDisconnected = useRef(false);

	// Connect function
	const connect = useCallback(() => {
		if (socketRef.current) {
			socketRef.current.disconnect();
		}

		socketRef.current = io(url, {
			autoConnect: immediate,
			reconnection: true, // Default Socket.IO behavior
			reconnectionAttempts: maxRetries === Infinity ? 0 : maxRetries, // 0 means infinite in Socket.IO
			...socketOptions,
		});

		socketRef.current.on("connect", () => {
			retryCountRef.current = 0;
			setIsConnected(true);
			onConnect?.();
		});

		socketRef.current.on("disconnect", () => {
			if (!isManuallyDisconnected.current) {
				// Attempt reconnection, if applicable
				socketRef.current?.connect();
			}
		});

		socketRef.current.on("reconnect_failed", () => {
			onMaxRetriesExceeded?.();
		});

		socketRef.current.on("error", (error) => {
			onError?.(error); // Catch general errors
		});

		// Bind custom event listeners
		eventNames.forEach((event) => {
			socketRef.current?.off(event); // Remove any existing listener
			socketRef.current?.on(event, (data: unknown) => {
				onMessage?.(event, data);
			});
		});
	}, [
		url,
		socketOptions,
		maxRetries,
		onConnect,
		onError,
		onMaxRetriesExceeded,
		onMessage,
		eventNames,
		immediate,
	]);

	// Disconnect function
	const disconnect = useCallback(() => {
		isManuallyDisconnected.current = true;
		socketRef.current?.disconnect();
	}, []);

	// Send message function
	const sendMessage = useCallback((event: string, data: unknown) => {
		if (socketRef.current?.connected) {
			socketRef.current.emit(event, data);
		}
	}, []);

	// Effect to manage connection lifecycle
	useEffect(() => {
		if (immediate) {
			connect();
		}

		return () => {
			eventNames.forEach((event) => socketRef.current?.off(event));
			socketRef.current?.disconnect();
		};
	}, [connect, disconnect, immediate, eventNames]); // Include eventNames for cleanup

	// Memoized return object
	return useMemo(
		() => ({
			isConnected,
			sendMessage,
			connect,
			disconnect,
			...(exposeSocket ? { getSocket: () => socketRef.current } : {}),
		}),
		[isConnected, sendMessage, connect, disconnect, exposeSocket]
	);
}
