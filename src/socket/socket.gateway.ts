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

    const allKeys = Array.from(this.clients.entries())
    .filter(([, value]) => value === key)
    .map(([key, ]) => key);

    allKeys.forEach(element => {
      this.server.to(String(element)).emit('orderCreated', { message: 'У вас новый заказ!' });
    });
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