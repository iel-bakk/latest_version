import { messageDto } from "../message/message.dto";

export class chatDto {
    isOwner : boolean;

    content : string;

    avatar : string;

    sender : string;
}