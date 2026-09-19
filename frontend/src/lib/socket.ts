import { io } from 'socket.io-client';

// Kitchen namespace — connects when imported
export const kitchenSocket = io('/kitchen', {
  autoConnect: false,
  transports: ['websocket'],
});
