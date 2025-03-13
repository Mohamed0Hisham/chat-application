import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket(url, options = {}) {
	const {
		onConnect,
		onDisconnect,
		onError,
		onMessage,
		eventNames = [],
	} = options;
	const [isConnected, setIsConnected] = useState(false);
	const socketRef = useRef(null);

	useEffect(() => {
		socketRef.current = io(url, { autoConnect: true });

		socketRef.current.on("connect", () => {
			setIsConnected(true);
			onConnect && onConnect();
		});

		socketRef.current.on("disconnect", () => {
			setIsConnected(false);
			onDisconnect && onDisconnect();
		});

		socketRef.current.on("connect_error", (error) => {
			onError && onError(error);
		});

		eventNames.forEach((event) => {
			socketRef.current.on(event, (data) => {
				onMessage && onMessage(event, data);
			});
		});

		return () => {
			socketRef.current.disconnect();
		};
	}, [url]);

	const sendMessage = (event, data) => {
		if (socketRef.current) {
			socketRef.current.emit(event, data);
		}
	};

	return { isConnected, sendMessage, socket: socketRef.current };
}
