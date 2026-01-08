import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useLogin } from "./useLogin";

export const useSocket = () => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { logedinUser } = useLogin();

  useEffect(() => {
    // Only connect if user is logged in
    if (!logedinUser?.data?._id) {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // If socket already exists and is connected, don't create a new one
    if (socketRef.current?.connected) {
      setSocket(socketRef.current);
      setIsConnected(true);
      return;
    }

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Get backend URL - use same as axios config
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4040";
    
    // Remove /api/v1 if present in URL for socket connection
    const socketUrl = backendUrl.replace(/\/api\/v1$/, "").replace(/\/$/, "");
    
    // console.log("🔌 Creating socket connection to:", socketUrl);

    // Create socket connection
    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      // console.log("✅ Socket connected:", newSocket.id);
      setSocket(newSocket);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      // console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      // console.error("❌ Socket connection error:", error);
      setIsConnected(false);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      // console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
    });

    // newSocket.on("reconnect_error", (error) => {
    //   // console.error("❌ Reconnection error:", error);
    // });

    newSocket.on("reconnect_failed", () => {
      // console.error("❌ Socket reconnection failed");
      setIsConnected(false);
    });

    // // Test event listener
    // newSocket.on("test", (data) => {
    //   console.log("🧪 Test event received from server:", data);
    // });

    // Cleanup on unmount
    return () => {
      if (newSocket && newSocket.connected) {
        // console.log("🧹 Cleaning up socket connection");
        newSocket.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [logedinUser?.data?._id]);

  return socket;
};

