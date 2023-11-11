import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { messageDto } from "src/DTOs/message/message.dto";
import { converationRepositroy } from "src/modules/conversation/conversation.repository";
import { messageRepository } from "src/modules/message/message.repository";
import { UsersRepository } from "src/modules/users/users.repository";
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private user;
    private conversation;
    private message;
    constructor(jwtService: JwtService, user: UsersRepository, conversation: converationRepositroy, message: messageRepository);
    server: Server;
    private clientsMap;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: Socket): void;
    hanldeMessage(message: messageDto): Promise<void>;
    sendToSocket(message: messageDto): Promise<void>;
}
