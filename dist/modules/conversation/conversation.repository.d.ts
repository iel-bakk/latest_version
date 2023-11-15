import { ConversationDto } from "src/DTOs/conversation/conversation.dto";
import { PrismaService } from "src/modules/database/prisma.service";
export declare class converationRepositroy {
    private Prisma;
    constructor(Prisma: PrismaService);
    createConversation(_recieverId: string, _senderId: string): Promise<ConversationDto>;
    numberOfConversations(_id: string): Promise<number>;
    getConversations(_id: string): Promise<ConversationDto[]>;
    findConversations(_recieverId: string, _senderId: string): Promise<ConversationDto | null>;
    deleteConversation(conversationData: ConversationDto): Promise<string>;
}
