let socket;

const socket_URL = process.env.SOCKET_URL || 'wss://city-ws.herokuapp.com/';

export const initiateSocketConnection = () => {
  socket = new WebSocket(socket_URL);
};

export const connectSocket = callback => {
  if (!socket || socket.readyState === 3) {
    initiateSocketConnection();
  }

  socket.onmessage = event => {
    return callback(JSON.parse(event.data));
  };
};

export const closeSocketConnection = () => {
  socket && socket.close();
};
