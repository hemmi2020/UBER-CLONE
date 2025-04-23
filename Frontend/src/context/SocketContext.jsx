import React, { createContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = ({ children, userId, userType }) => {
  const socket = useMemo(() => io(`${import.meta.env.VITE_BASE_URL}`), []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      console.log(socket.id);
      if (userId && userType) {
        socket.emit("join", { userId, userType });
        console.log(`Emitted join event with userId: ${userId}, userType: ${userType}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket, userId, userType]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
