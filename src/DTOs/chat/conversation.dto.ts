import { chatDto } from "./chat.dto";

export class frontData {
    Conversationid : string;
    
    avatar : string;
    
    username : string;

    online : boolean;

    updatedAt  : Date;
    
    id : number;
    
    messages : chatDto[];
}