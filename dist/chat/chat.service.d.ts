import { channelDto } from 'src/DTOs/channel/channel.dto';
import { PrismaService } from 'src/modules/database/prisma.service';
export declare class ChannelsService {
    private prisma;
    constructor(prisma: PrismaService);
    createChannel(channelData: channelDto, id: string): Promise<void>;
    addUserToChannel(userId: string, channelId: string): Promise<void>;
    removeUserFromChannel(userId: string, channelId: string): Promise<void>;
    banUserFromChannel(userId: string, channelId: string): Promise<void>;
}
