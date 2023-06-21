import io from "socket.io-client";

export const socket = io(
	process.env["REACT_APP_API"] ?? "http://localhost:5000",
	{ forceNew: true, retries: 10, transports: ["websocket"] }
);
