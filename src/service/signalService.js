import * as signalR from "@microsoft/signalr";

let connection = null;
let startPromise = null;
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.31.161:5023";

export const getSignalRConnection = (token) => {
  if (connection) return connection;

 connection = new signalR.HubConnectionBuilder()
    .withUrl(`${BASE_URL}/hubs/blogs`, {
      // If your hub requires [Authorize], use this:
      accessTokenFactory: () => token,
      // This helps with the CORS 'include' credentials requirement
      withCredentials: true, 
    })
    .withAutomaticReconnect()
    .build();
  connection.onreconnecting((error) => {
    console.log("SignalR reconnecting...", error);
  });

  connection.onreconnected((connectionId) => {
    console.log("SignalR reconnected:", connectionId);
  });

  connection.onclose((error) => {
    console.log("SignalR closed:", error);
    startPromise = null;
  });

  return connection;
};

export const ensureSignalRStarted = async () => {
  const conn = getSignalRConnection();

  if (conn.state === signalR.HubConnectionState.Connected) {
    return conn;
  }

  if (!startPromise) {
    startPromise = conn.start().catch((error) => {
      startPromise = null;
      throw error;
    });
  }

  await startPromise;
  return conn;
};