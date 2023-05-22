import io from "socket.io-client";
import store from "./store/index";

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

    store.dispatch("user/listenForUserUpdates");
    store.dispatch("swapRequests/listenForSwapRequestUpdates");
    store.dispatch("swapRequests/listenForswapRequestReceived");
    store.dispatch("swapRequests/listenForSwapRequestAccepted");
    store.dispatch("swapRequests/listenForSwapRequestDeleted");
    store.dispatch("swapRequests/listenForSwapRequestRejected");
  });

  socket.on('connect_error', (error) => {
    console.error('Error connecting to the server:', error);
  });

  return socket;
}

export function getSocket() {
  return socket;
}