import { ConversationDto } from "src/DTOs/conversation/conversation.dto";
export declare class MessageModel {
    id: string;
    conversationId: string;
    time: string;
    content: string;
    senderId: string;
    recieverId: string;
    recieved: boolean;
    conversation: ConversationDto;
    constructor(_conversationId: string, _content: string, _senderId: string, _recieverId: string);
}
