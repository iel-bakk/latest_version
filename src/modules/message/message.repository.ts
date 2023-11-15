import { Injectable } from "@nestjs/common";
import { UserDto } from "src/DTOs/User/user.dto";
import { chatDto } from "src/DTOs/chat/chat.dto";
import { ConversationDto } from "src/DTOs/conversation/conversation.dto";
import { messageDto } from "src/DTOs/message/message.dto";
import { PrismaService } from "src/modules/database/prisma.service";


@Injectable()
export class messageRepository {
    constructor (private Primsa : PrismaService) {}


    async CreateMesasge(message : messageDto) : Promise<messageDto> {
        this.Primsa.conversation.update({where : {id : message.conversationId},
        data : {
            updatedAt : new Date
        }    
        })
        return await this.Primsa.message.create({data : {
            senderId : message.senderId,
            conversationId : message.conversationId,
            recieverId : message.recieverId,
            content : message.content,
            date : new Date()
        }})
    }

    async getMessages(_conversation : ConversationDto, requesterId : string) : Promise<any> {
        let messages : messageDto[] = await this.Primsa.message.findMany({where : {
            conversationId : _conversation.id
        },
        orderBy: {
            date: 'desc',
          },
        })
        let _sender : UserDto = await this.Primsa.user.findUnique({where : {id : _conversation.senderId}})
        let _reciever : UserDto = await this.Primsa.user.findUnique({where : {id : _conversation.recieverId}})
        if (messages && _sender && _reciever) {
            let data : chatDto[] = []
            messages.forEach((message) => {
                data.push( {
                    isOwner : (requesterId == message.senderId),
                    content : message.content,
                    avatar : (_sender.id == message.senderId) ?  _sender.avatar : _reciever.avatar,
                    sender : (_sender.id == message.senderId) ?  _sender.username : _reciever.username,
                    date : message.date
                } )
            })
            return data
        }
    }

    async DeleteMessage(id : string) : Promise<string> {
        await this.Primsa.message.delete({where : {id}});
        return "deleted"
    }
}