import { useContext } from "react";
import { WebSocketContext } from "../context/websocket-context"; // was "../context/WebSocketContext"

export function useWebSocketContext() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  }
  return ctx;
}
