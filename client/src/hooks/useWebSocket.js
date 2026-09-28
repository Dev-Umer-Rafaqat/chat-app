import { useEffect } from "react";

import { useWebSocketContext } from "./useWebSocketContext";

// Convenience hook: subscribes `onEvent` to incoming WebSocket messages
// for as long as the calling component is mounted, and cleans up automatically.

function useWebSocket(onEvent) {
  const {
    status,

    sendMessage,

    setActiveConversation,

    clearActiveConversation,

    subscribe,
  } = useWebSocketContext();

  useEffect(() => {
    if (!onEvent) return;

    return subscribe(onEvent);
  }, [onEvent, subscribe]);

  return {
    status,

    sendMessage,

    setActiveConversation,

    clearActiveConversation,
  };
}

export default useWebSocket;
