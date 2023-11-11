import { messageDto } from "src/DTOs/message/message.dto";
import { PrismaService } from "src/modules/database/prisma.service";
export declare class messageRepository {
    private Primsa;
    constructor(Primsa: PrismaService);
    CreateMesasge(message: messageDto): Promise<messageDto>;
    DeleteMessage(id: string): Promise<string>;
}
