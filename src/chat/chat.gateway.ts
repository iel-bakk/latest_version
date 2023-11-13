import { JwtService } from "@nestjs/jwt";
import {  MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserDto } from "src/DTOs/User/user.dto";
import { channelDto } from "src/DTOs/channel/channel.dto";
import { channelMessageDto } from "src/DTOs/channel/channel.messages.dto";
import { messageDto } from "src/DTOs/message/message.dto";
import { converationRepositroy } from "src/modules/conversation/conversation.repository";
import { messageRepository } from "src/modules/message/message.repository";
import { UsersRepository } from "src/modules/users/users.repository";
import { ChannelsService } from "./chat.service";
import { use } from "passport";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor (private jwtService: JwtService, private user: UsersRepository, private conversation : converationRepositroy, private message: messageRepository, private channel : ChannelsService) {
        this.clientsMap = new Map<string, Socket>();
    }
    @WebSocketServer() server: Server;
    private clientsMap: Map<string, Socket>;

    async handleConnection(client: Socket, ...args: any[]) {
      try {
            let cookie : string = client.client.request.headers.cookie;
            if (cookie) {
              const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
              console.log('here is the jwt : ', jwt);
              let user;
              user =  this.jwtService.verify(jwt);
              console.log('here');
              console.log(user)
              if (user) {
                const test = await this.user.getUserById(user.sub)
                if (test) {
                  console.log(test.id);
                  this.clientsMap.set(test.id, client);
                  console.log(`this is a test : ${test.id} ****`)
                }
              }
            }
          else {
            console.log("user dosen't exist in database");
            client.emit('ERROR', "RAH KAN3REF BAK, IHCHEM")
            client.disconnect();
          }
        }
        catch (error) {
          console.log("user dosen't exist in database");
          client.emit('ERROR', "RAH KAN3REF BAK, IHCHEM")
          client.disconnect()
          console.log("invalid data : check JWT or DATABASE QUERIES")
      }
  }

      handleDisconnect(client: Socket) {
            this.clientsMap.delete(client.id); // Remove the client from the map when disconnected
      }

      @SubscribeMessage('channelMessage')
      async handleChannelMessage(@MessageBody() message: channelMessageDto) {
        try {
          console.log('got here ff : ',message.sender);
          let _user : UserDto = await this.user.getUserById(message.sender)
          let channel : channelDto = await this.channel.getChannelByName(message.channelName)
          if (_user && channel && channel.users.includes(_user.id))  {
            channel.users.forEach((user) => {
              console.log('user :', user );
              if (user != message.sender && channel.users.includes(user)) {
                console.log('reciever : ',user);
                let socket: Socket = this.clientsMap.get(user)
                if (socket)
                  socket.emit('channelMessage', message);
              }
            })
            await this.channel.createChannelMessage(message)
            }
            else {
              let socket: Socket = this.clientsMap.get(_user.id)
              if (socket) {
                // console.log(socket);
                console.log('send error message');
                socket.emit('ERROR', 'SERVER : your not in channel .');
              }
            }
        }
        catch (error) {
          console.log('error while sending channel message .');
        }
      }

      @SubscribeMessage('SendMessage')
        async hanldeMessage(@MessageBody() message: messageDto) {
          try {
            const sender = await this.user.getUserById(message.senderId);
            const reciever = await this.user.getUserById(message.recieverId);
            if (!sender || !reciever) {
              console.log("invalid data : Wrong sender or reciever info.")
              return ;
            }
            if (reciever.bandUsers.includes(sender.id)) {
              console.log("a banned user can't send messages .");
              return ;
            }
            let achievementCheck : number = await this.conversation.numberOfConversations(sender.id)
            if (achievementCheck > 0) {
              if (!sender.achievements.includes('send your first message')) {
                await this.user.updateAcheivement('send your first message', sender.id)
                console.log('added first message')
            }
          }
          let conversations = await this.conversation.findConversations(reciever.id, sender.id);
          if (!conversations) {
            const tmp = await this.conversation.createConversation(reciever.id, sender.id)
            message.conversationId = tmp.id;
            this.sendToSocket(message);
          }
          else {
            message.conversationId = conversations.id;
            this.sendToSocket(message);
          }
        }
        catch (error) {
          console.log('error while sending message .')
        }
        }
        
        async sendToSocket(message: messageDto) {
          try {

            console.log(message)
            const socket: Socket = this.clientsMap.get(message.recieverId);
            await this.message.CreateMesasge(message);
            if (socket) {
              socket.emit('RecieveMessage', message); // Replace 'your-event-name' with the actual event name
            } else {
              console.error(`Socket with ID ${message.recieverId} not found.`);
            }
          }
          catch (error) {
            console.log('error in the sendToSocket function')
          }
        }
}