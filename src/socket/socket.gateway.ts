import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class OrderGateway {
  @WebSocketServer()
  server: Server;

  private clients: Map<string, number> = new Map();

  @SubscribeMessage('createOrder')
  handleCreateOrder(@MessageBody() data: any) {

    const key = data.IDCompany;
    const socketId = this.clients.get(key);

    if (socketId) {
      this.server.to(String(socketId)).emit('orderCreated', { message: 'У вас новый заказ!' });
    }
  }

  handleConnection(client: Socket) {
    const key = client.handshake.query['key'];
    if (key) {
      this.clients.set(client.id, Number(key));
    }
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
  }
}