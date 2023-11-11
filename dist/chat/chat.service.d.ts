import { channelDto } from 'src/DTOs/channel/channel.dto';
import { PrismaService } from 'src/modules/database/prisma.service';
export declare class ChannelsService {
    private prisma;
    constructor(prisma: PrismaService);
    createChannel(channelData: channelDto, id: string): Promise<any>;
    addUserToChannel(userId: string, channelId: string): Promise<void>;
    removeUserFromChannel(userId: string, channelId: string): Promise<void>;
    banUserFromChannel(username: string, channelName: string): Promise<void>;
    getChannelByName(channelName: string): Promise<channelDto>;
}
