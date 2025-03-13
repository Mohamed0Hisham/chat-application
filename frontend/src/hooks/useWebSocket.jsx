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
	const isManualClose = useRef(false);
	const reconnectTimeout = useRef(null);

	const connect = useCallback(() => {
		isManualClose.current = false;
		if (websocketRef.current) {
			websocketRef.current.close();
		}

		websocketRef.current = new WebSocket(url);

		websocketRef.current.onopen = (event) => {
			setIsConnected(true);
			onOpen && onOpen(event);
		};

		websocketRef.current.onmessage = async (event) => {
			const message =
				event.data instanceof Blob
					? await event.data.arrayBuffer()
					: event.data;
			setLastMessage(message);
			onMessage && onMessage(message);
		};
		websocketRef.current.onerror = (event) => {
			onError && onError(event);
		};

		websocketRef.current.onclose = (event) => {
			setIsConnected(false);
			onClose && onClose(event);
			if (reconnect && !isManualClose.current) {
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
			if (
				isConnected &&
				websocketRef.current &&
				websocketRef.current?.readyState === WebSocket.OPEN
			) {
				websocketRef.current.send(message);
			}
		},
		[isConnected]
	);

	useEffect(() => {
		connect();

		return () => {
			isManualClose.current = true;
			if (websocketRef.current) {
				websocketRef.current.close();
			}
			if (reconnectTimeout.current) {
				clearTimeout(reconnectTimeout.current);
			}
		};
	}, [connect]);

	return { isConnected, sendMessage, lastMessage };
}
