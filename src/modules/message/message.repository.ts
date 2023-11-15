import { Injectable } from "@nestjs/common";
import { messageDto } from "src/DTOs/message/message.dto";
import { PrismaService } from "src/modules/database/prisma.service";


@Injectable()
export class messageRepository {
    constructor (private Primsa : PrismaService) {}

    async CreateMesasge(message : messageDto) : Promise<messageDto> {
        return await this.Primsa.message.create({data : {
            senderId : message.senderId,
            conversationId : message.conversationId,
            recieverId : message.recieverId,
            content : message.content
        }})
    }

    async getMessages(_conversationId : string) : Promise<messageDto[]> {
        return await this.Primsa.message.findMany({where : {
            conversationId : _conversationId
        }})
    }

    async DeleteMessage(id : string) : Promise<string> {
        await this.Primsa.message.delete({where : {id}});
        return "deleted"
    }
}