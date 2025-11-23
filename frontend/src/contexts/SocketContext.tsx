import React, {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { Socket } from "socket.io-client";
import socket from "../lib/socket";

interface SocketContextType {
    socket: Socket;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

    useEffect(() => {
        // Event listeners for connection status
        const onConnect = () => {
            setIsConnected(true);
        };

        const onDisconnect = () => {
            setIsConnected(false);
        };

        // Attach event listeners
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        // Connect socket when provider mounts
        socket.connect();

        // Cleanup-remove listeners and disconnect when provider unmounts
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.disconnect();
        };
    }, []);

    const connect = () => {
        if (!socket.connected) {
            socket.connect();
        }
    };

    const disconnect = () => {
        if (socket.connected) {
            socket.disconnect();
        }
    };

    const value: SocketContextType = {
        socket,
        isConnected,
        connect,
        disconnect,
    };

    return (
        <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
    );
};

export const useSocketContext = (): SocketContextType => {
    const context = React.useContext(SocketContext);
    if (!context) {
        throw new Error("useSocketContext must be used within a SocketProvider");
    }
    return context;
};
