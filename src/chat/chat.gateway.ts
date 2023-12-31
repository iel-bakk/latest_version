import { JwtService } from "@nestjs/jwt";
import {  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
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
import { frontData } from "src/DTOs/chat/conversation.dto";
import { chatDto } from "src/DTOs/chat/chat.dto";
import { ConversationDto } from "src/DTOs/conversation/conversation.dto";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor (private jwtService: JwtService, private user: UsersRepository, private conversation : converationRepositroy, private message: messageRepository, private channel : ChannelsService) {
        this.clientsMap = new Map<string, Socket>();
    }
    @WebSocketServer() server: Server;
    private clientsMap: Map<string, Socket>;

    async handleConnection(client: Socket, ...args: any[]) {
      try {
        // console.log('here');
        
            let cookie : string = client.client.request.headers.cookie;
            if (cookie) {
              const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
              // console.log('here is the jwt : ', jwt);
              let user;
              user =  this.jwtService.verify(jwt);
              // console.log('here');
              console.log(user)
              if (user) {
                const test = await this.user.getUserById(user.sub)
                if (test) {
                  console.log(test.id);
                  this.clientsMap.set(test.id, client);
                  await this.user.updateUserOnlineStatus(true, user.sub)
                  // console.log(`this is a test : ${test.id} ****`)
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

      async handleDisconnect(client: Socket) {
          let cookie : string = client.client.request.headers.cookie;
          if (cookie) {
            const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
            console.log('here is the jwt : ', jwt);
            let user;
            user =  this.jwtService.verify(jwt);
            if (user) {
              const test = await this.user.getUserById(user.sub)
              if (test) {
                console.log(test.id);
                await this.user.updateUserOnlineStatus(false, test.id)
                console.log(`this is a test : ${test.id} ****`)
              }
            }
          }
          this.clientsMap.delete(client.id);
      }

      @SubscribeMessage('channelMessage')
      async handleChannelMessage(@MessageBody() message: channelMessageDto,@ConnectedSocket() client : Socket) {
        try {
          
          let cookie : string = client.client.request.headers.cookie;
            if (cookie) {
              const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
              let user;
              user =  this.jwtService.verify(jwt);
              console.log(user)
              if (user) {
                const _user = await this.user.getUserById(user.sub)
                if (_user) {
                  if (!_user.achievements.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322994/vp6r4ephqymsyrzxgd0h.png'))
                    this.user.updateAcheivement('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322994/vp6r4ephqymsyrzxgd0h.png', _user.id)
                  let channel : channelDto = await this.channel.getChannelByName(message.channelName)
                  console.log(channel, _user);
                  if (_user && channel && channel.users.includes(_user.id))  {
                    message.sender = _user.id
                    await this.channel.createChannelMessage(message)
                    channel.users.forEach((user) => {
                      if (user != message.sender && channel.users.includes(user)) {
                        let socket: Socket = this.clientsMap.get(user)
                      if (socket) {
                        socket.emit('channelMessage', message);
                      }
                    }
                  })
              }
            else {
              let socket: Socket = this.clientsMap.get(_user.id)
                  if (socket) {
                      socket.emit('ERROR', 'SERVER : your not in channel .');
                   }
                   throw ('no such user or channel ...')
                }
            }
          }
        }
        else
          throw('unAuthorized Action ....')
      }
        catch (error) {
          console.log('error while sending channel message .');
        }
      }

      @SubscribeMessage('SendMessage')
        async hanldeMessage(@MessageBody() message: messageDto, @ConnectedSocket() client : Socket) {
          try {
            let cookie : string = client.client.request.headers.cookie;
            if (cookie) {
              const jwt:string = cookie.substring(cookie.indexOf('=') + 1)
              let user;
              user =  this.jwtService.verify(jwt);
              console.log(user)
              if (user) {
                  const sender = await this.user.getUserByUsername(user.sub);
                  const reciever = await this.user.getUserByUsername(message.recieverId);
                  if (!sender || !reciever || (sender.id == reciever.id)) {
                    console.log("invalid data : Wrong sender or reciever info.")
                    return ;
                  }
                  if (reciever.bandUsers.includes(sender.id)) {
                    console.log("a banned user can't send messages .");
                    return ;
                  }
                  let achievementCheck : number = await this.conversation.numberOfConversations(sender.id)
                  if (achievementCheck > 0) {
                    if (!sender.achievements.includes('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322994/vp6r4ephqymsyrzxgd0h.png')) {
                      await this.user.updateAcheivement('https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322994/vp6r4ephqymsyrzxgd0h.png', sender.id)
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
        }
        else {
          throw (`invalid Request : not Authorized ...`)
        }
        }
        catch (error) {
          console.log('error while sending message .')
        }
      }
      
      async sendToSocket(message: messageDto) {
        try {
          console.log(message)
          let _reciever : UserDto = await this.user.getUserByUsername(message.recieverId)
          if (_reciever) {
            const socket: Socket = this.clientsMap.get(_reciever.id);
            await this.message.CreateMesasge(message);
            if (socket) {
              this.conversation.updateConversationDate(message.conversationId)
              let data : chatDto = new chatDto;
              data.content = message.content
              data.sender = message.senderId
              data.avatar = null
              data.isOwner = false
              data.conversationId = message.conversationId 
              socket.emit('RecieveMessage', data); // Replace 'your-event-name' with the actual event name
            } else {
              this.conversation.updateConversationDate(message.conversationId)
              console.error(`Socket with ID ${message.recieverId} not found.`);
            }
          }
          }
          catch (error) {
            console.log('error in the sendToSocket function')
          }
        }
}