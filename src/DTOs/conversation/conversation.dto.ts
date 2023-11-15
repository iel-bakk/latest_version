import { IsString } from "class-validator";

export class ConversationDto {
    @IsString()
    id              : string
    
    @IsString()
    senderId         : string

    @IsString()
    recieverId         : string
}