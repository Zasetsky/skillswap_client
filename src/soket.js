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

    // Chat
    store.dispatch("chat/listenForNewChat");
    store.dispatch("chat/listenForNewMessage");
    store.dispatch("deal/listenIsSending");

    // Deal
    store.dispatch("deal/listenForDealObserver");
    store.dispatch("deal/listenForDealUpdates");
    store.dispatch("deal/listenForRescheduleConfirmed");
    store.dispatch("deal/listenForDealConfirmed");
    store.dispatch("deal/listenForCancellationRequested");
    store.dispatch("deal/listenForContinuationRequested");
    store.dispatch("deal/listenForApproveContinuation");
    store.dispatch("deal/listenForApproveCancellation");

    // swapRequest
    store.dispatch("swapRequests/listenForSwapRequestSent");
    store.dispatch("swapRequests/listenForSwapRequestAccepted");
    store.dispatch("swapRequests/listenForSwapRequestDeleted");
    store.dispatch("swapRequests/listenForSwapRequestRejected");
    store.dispatch("swapRequests/listenForSwapRequestUpdates");

    // review
    store.dispatch("review/listenCreateReview");
  });

  socket.on('connect_error', (error) => {
    console.error('Error connecting to the server:', error);
  });

  return socket;
}

export function getSocket() {
  return socket;
}