import { useState, useEffect, useRef, useCallback } from "react";

function useWebSocket(url, options = {}) {
	const {
		reconnect = true,
		reconnectInterval = 5000,
		onOpen,
		onMessage,
		onError,
		onClose,
	} = options;
	const [isConnected, setIsConnected] = useState(false);
	const [lastMessage, setLastMessage] = useState(null);
	const websocketRef = useRef(null);
	const reconnectTimeout = useRef(null);

	const connect = useCallback(() => {
		websocketRef.current = new WebSocket(url);

		websocketRef.current.onopen = (event) => {
			setIsConnected(true);
			onOpen && onOpen(event);
		};

		websocketRef.current.onmessage = (event) => {
			setLastMessage(event.data);
			onMessage && onMessage(event);
		};

		websocketRef.current.onerror = (event) => {
			onError && onError(event);
		};

		websocketRef.current.onclose = (event) => {
			setIsConnected(false);
			onClose && onClose(event);
			if (reconnect) {
				reconnectTimeout.current = setTimeout(
					connect,
					reconnectInterval
				);
			}
		};
	}, [
		url,
		reconnect,
		reconnectInterval,
		onOpen,
		onMessage,
		onError,
		onClose,
	]);

	const sendMessage = useCallback(
		(message) => {
			if (isConnected && websocketRef.current) {
				websocketRef.current.send(message);
			}
		},
		[isConnected]
	);

	useEffect(() => {
		connect();

		return () => {
			if (websocketRef.current) {
				websocketRef.current.close();
			}
			clearTimeout(reconnectTimeout.current);
		};
	}, [connect]);

	return { isConnected, sendMessage, lastMessage };
}
