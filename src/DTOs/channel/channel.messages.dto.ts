import { IsString } from "class-validator";


export class channelMessageDto {

    @IsString()
    sender  :   string
    
    @IsString()
    content  :   string

    @IsString()
    channelName : string
}