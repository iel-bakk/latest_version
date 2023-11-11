import { Injectable } from '@nestjs/common';
import { channelDto } from 'src/DTOs/channel/channel.dto';
import { PrismaService } from 'src/modules/database/prisma.service';

@Injectable()
export class ChannelsService {
 constructor(private prisma: PrismaService) {}

 async createChannel(channelData: channelDto , id : string) {
    console.log(`channel name : ${name} userId : ${id}`)
    channelData.users.push(id);
    channelData.adminUsers.push(id);
    try {
        await this.prisma.channel.create({data : {
            name : "area 420",
            admins : channelData.adminUsers,
            users : channelData.users,
        }})
    }
    catch (error) {
        console.log('error');
    }
 }

 async addUserToChannel(userId: string, channelId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
    let tmp : string[] = channel.users;
    if (!tmp.includes(userId) && !channel.bannedUsers.includes(userId))
        tmp.push(userId);
    if (user && channel) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { channels: tmp },
      });
      await this.prisma.channel.update({
        where : {id : channelId},
        data : {users : tmp},
      })
    }
 }

 async removeUserFromChannel(userId: string, channelId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
    
    if (user && channel && channel.users.includes(userId)) {
        if (user.channels.includes(channelId) && channel.users.includes(userId)) {
            user.channels = user.channels.map((channel) => {
                if (channel != channelId)
                return channel })
            channel.users.map((user)=> {
                if (user != userId)
                    return user
            })
        await this.prisma.user.update({
            where: { id: userId },
            data : {channels : user.channels},    
        },
        );
        await this.prisma.channel.update({
            where : {id : channelId},
            data : {users : channel.users},
        })
        }
    }
 }

 async banUserFromChannel(userId: string, channelId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
  
    if (user && channel && channel.users.includes(userId)) {
      await this.removeUserFromChannel(userId, channelId);
      channel.bannedUsers.push(userId);
      await this.prisma.channel.update({
        where: { id: channelId },
        data: { bannedUsers: channel.bannedUsers } },
      );
    }
 }
//  async assignAdminToChannel(userId: string, channelId: string) {
//     const user = await this.prisma.user.findUnique({ where: { id: userId } });
//     const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });

//     if (user && channel) {
//       await this.prisma.user.update({
//         where: { id: userId },
//         data: { adminChannels: { connect: { id: channelId } } },
//       });
//     }
//  }
}
