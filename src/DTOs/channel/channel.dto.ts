import { IsString } from "class-validator";



export class channelDto {
    @IsString()
    id : string;

    @IsString()
    name : string

    users : string[]; 
    
    admins : string[]; 
    
    bannedUsers : string[];
    @IsString()
    owner       : string;

    IsPrivate   : boolean;

    IsProtected   : boolean;
    @IsString()
    password    : string;
}