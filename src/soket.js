import io from "socket.io-client";

const API_URL = "http://localhost:3000/";

let socket;

export function connectSocket(token) {
  socket = io(API_URL, {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  socket.on('connect', () => {
    console.log('Successfully connected to the server.');

    socket.emit('user_online');
  });

  socket.on('connect_error', (error) => {
    console.error('Error connecting to the server:', error);
  });

  return socket;
}

export function getSocket() {
  return socket;
}