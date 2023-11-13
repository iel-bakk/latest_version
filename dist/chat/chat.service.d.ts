import { UserDto } from 'src/DTOs/User/user.dto';
import { channelDto } from 'src/DTOs/channel/channel.dto';
import { channelMessageDto } from 'src/DTOs/channel/channel.messages.dto';
import { PrismaService } from 'src/modules/database/prisma.service';
export declare class ChannelsService {
    private prisma;
    constructor(prisma: PrismaService);
    createChannel(channelData: channelDto, id: string): Promise<any>;
    createChannelMessage(message: channelMessageDto): Promise<any>;
    addUserToChannel(userId: string, _channel: channelDto): Promise<any>;
    removeUserFromChannel(userId: string, channelId: string): Promise<any>;
    banUserFromChannel(username: string, channelName: string): Promise<any>;
    unBanUserFromChannel(username: string, channelName: string): Promise<any>;
    getChannelByName(channelName: string): Promise<channelDto>;
    assignAdminToChannel(user: UserDto, channelName: string): Promise<any>;
    removeAdminPrivilageToUser(username: string, channelName: string): Promise<any>;
    deleteChannel(channelId: string): Promise<any>;
    setPasswordToChannel(password: string, channelName: string): Promise<{
        id: string;
        name: string;
        users: string[];
        admins: string[];
        bannedUsers: string[];
        owner: string;
        IsPrivate: boolean;
        IsProtected: boolean;
        password: string;
    }>;
    unsetPasswordToChannel(channelName: string): Promise<{
        id: string;
        name: string;
        users: string[];
        admins: string[];
        bannedUsers: string[];
        owner: string;
        IsPrivate: boolean;
        IsProtected: boolean;
        password: string;
    }>;
    BanUser(user: UserDto, ban: UserDto): Promise<string>;
    unBanUser(user: UserDto, ban: UserDto): Promise<string>;
    getChannelMessages(channel: string): Promise<channelMessageDto[]>;
}
