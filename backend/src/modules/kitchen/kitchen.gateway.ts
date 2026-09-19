import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' }, namespace: '/kitchen' })
export class KitchenGateway {
  @WebSocketServer()
  server: Server;

  // Events will be implemented in Step 3
}
