import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface UseWebSocketOptions {
	reconnect?: boolean;
	reconnectInterval?: number;
	maxReconnectInterval?: number;
	reconnectDecay?: number;
	maxRetries?: number;
	onOpen?: (event: Event) => void;
	onMessage?: (message: unknown) => void;
	onError?: (event: Event | Error) => void;
	onClose?: (event: CloseEvent) => void;
	onParseError?: (error: Error) => void;
	onMaxRetriesExceeded?: () => void;
	messageParser?: (
		data: WebSocket["binaryType"],
		binaryType: "string" | "json" | "arraybuffer" // Updated signature
	) => Promise<unknown>;
	binaryType?: "string" | "json" | "arraybuffer";
	immediate?: boolean;
	exposeWebSocket?: boolean;
}

interface UseWebSocketReturn {
	isConnected: boolean;
	sendMessage: (message: string | ArrayBuffer | Blob) => void;
	lastMessage: unknown;
	disconnect: () => void;
	reconnect: () => void;
	websocket?: WebSocket | null;
}

function useWebSocket(
	url: string,
	options: UseWebSocketOptions = {}
): UseWebSocketReturn {
	const {
		reconnect = true,
		reconnectInterval = 5000,
		maxReconnectInterval = 30000,
		reconnectDecay = 1.5,
		maxRetries = Infinity,
		onOpen,
		onMessage,
		onError,
		onClose,
		onParseError,
		onMaxRetriesExceeded,
		messageParser = defaultMessageParser,
		binaryType = "json",
		immediate = true,
		exposeWebSocket = false,
	} = options;

	const [isConnected, setIsConnected] = useState(false);
	const [lastMessage, setLastMessage] = useState<unknown>(null);
	const websocketRef = useRef<WebSocket | null>(null);
	const isManualClose = useRef(false);
	const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const retryCount = useRef(0);

	const generateInterval = useCallback(() => {
		const interval =
			reconnectInterval * reconnectDecay ** retryCount.current;
		return Math.min(interval, maxReconnectInterval);
	}, [reconnectInterval, maxReconnectInterval, reconnectDecay]);

	const connect = useCallback(async () => {
		isManualClose.current = false;

		if (websocketRef.current) {
			websocketRef.current.close();
		}

		websocketRef.current = new WebSocket(url);

		websocketRef.current.onopen = (event) => {
			retryCount.current = 0;
			setIsConnected(true);
			onOpen?.(event);
		};

		websocketRef.current.onmessage = async (event) => {
			try {
				// Pass binaryType to the messageParser
				const parsed = await messageParser(event.data, binaryType);
				setLastMessage(parsed);
				onMessage?.(parsed);
			} catch (err) {
				const error =
					err instanceof Error
						? err
						: new Error("Message parsing failed");
				onParseError?.(error);
				onError?.(error);
			}
		};

		websocketRef.current.onerror = (event) => {
			onError?.(event);
		};

		websocketRef.current.onclose = (event) => {
			setIsConnected(false);
			onClose?.(event);

			if (
				reconnect &&
				!isManualClose.current &&
				retryCount.current < maxRetries
			) {
				retryCount.current += 1;
				const interval = generateInterval();
				reconnectTimeout.current = setTimeout(connect, interval);
			} else if (reconnect && retryCount.current >= maxRetries) {
				onMaxRetriesExceeded?.();
			}
		};
	}, [
		url,
		onOpen,
		onMessage,
		onError,
		onClose,
		onParseError,
		onMaxRetriesExceeded,
		reconnect,
		maxRetries,
		messageParser,
		binaryType, // Add binaryType to dependencies
		generateInterval,
	]);

	const disconnect = useCallback(() => {
		isManualClose.current = true;
		websocketRef.current?.close();
		if (reconnectTimeout.current) {
			clearTimeout(reconnectTimeout.current);
		}
	}, []);

	const reconnectManual = useCallback(() => {
		retryCount.current = 0;
		if (reconnectTimeout.current) {
			clearTimeout(reconnectTimeout.current);
		}
		connect();
	}, [connect]);

	const sendMessage = useCallback((message: string | ArrayBuffer | Blob) => {
		if (websocketRef.current?.readyState === WebSocket.OPEN) {
			websocketRef.current.send(message);
		}
	}, []);

	useEffect(() => {
		if (immediate) {
			connect();
		}
		return () => {
			disconnect();
		};
	}, [connect, disconnect, immediate]);

	return useMemo(
		() => ({
			isConnected,
			sendMessage,
			lastMessage,
			disconnect,
			reconnect: reconnectManual,
			...(exposeWebSocket ? { websocket: websocketRef.current } : {}),
		}),
		[
			isConnected,
			lastMessage,
			sendMessage,
			disconnect,
			reconnectManual,
			exposeWebSocket,
		]
	);
}

async function defaultMessageParser(
	data: string | Blob | ArrayBuffer,
	binaryType: "string" | "json" | "arraybuffer" = "json"
): Promise<unknown> {
	if (data instanceof Blob) {
		const arrayBuffer = await data.arrayBuffer();
		if (binaryType === "string") {
			return new TextDecoder().decode(arrayBuffer);
		}
		if (binaryType === "json") {
			const text = new TextDecoder().decode(arrayBuffer);
			return JSON.parse(text);
		}
		return arrayBuffer;
	}
	if (typeof data === "string") {
		if (binaryType === "json") {
			return JSON.parse(data);
		}
		return data;
	}
	return data;
}

export default useWebSocket;
