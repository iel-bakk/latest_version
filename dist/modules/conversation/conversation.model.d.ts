import { UserDto } from "src/DTOs/User/user.dto";
import { messageDto } from "src/DTOs/message/message.dto";
export declare class ConversationModel {
    id: string;
    senderId: string;
    recieverId: string;
    userA: UserDto;
    userB: UserDto;
    messages: messageDto[];
    constructor(_senderId: string, _recieverId: string);
}
