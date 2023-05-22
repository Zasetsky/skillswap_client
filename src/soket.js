import io from "socket.io-client";

const API_URL = "http://localhost:3000/";

let socket;

export function connectSocket(token) {
  if (!socket) {
    socket = io(API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return socket;
}

export function getSocket() {
  return socket;
}