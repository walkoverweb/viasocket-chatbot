// hooks/useSocket.js
import { useEffect } from "react";
import io from "socket.io-client";

const useSocket = (jwtToken, channelId) => {
  // const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Ensure a valid JWT token is provided before creating the socket
    if (!jwtToken) return;

    const socketUrl =
      "wss://chat.phone91.com/socket.io/?EIO=4&transport=websocket";

    // Initialize the socket connection
    const socketInstance = io(socketUrl, {
      auth: { token: jwtToken }, // Pass the JWT token for authentication
      transports: ["websocket"], // Prefer WebSocket transport
      reconnection: true, // Enable reconnection
      timeout: 20000, // 20-second timeout for the connection
      autoConnect: true, // Auto connect when the component mounts
    });

    // Update socket state once connected
    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection Error:", err);
    });
  }, [jwtToken, channelId]); // Re-run when JWT or channelId changes

  // return socket;
};

export default useSocket;
