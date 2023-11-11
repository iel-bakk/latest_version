import { Injectable } from '@nestjs/common';
import { channelDto } from 'src/DTOs/channel/channel.dto';
import { PrismaService } from 'src/modules/database/prisma.service';

@Injectable()
export class ChannelsService {
 constructor(private prisma: PrismaService) {}

 async createChannel(channelData: channelDto , id : string) : Promise<any> {
    console.log(`the users id ${id}`);
    let tmp : string[] = [id];
    try {
      console.log(channelData);
      let check : channelDto = await this.getChannelByName(channelData.name)
      if (check)
        return
      let channel: channelDto = await this.prisma.channel.create({data : {
        name : channelData.name,
        admins : tmp,
        users : tmp,
      }})
      let userTmp : string[] = [channel.id];
      console.log(userTmp);
          await this.prisma.user.update({
            where: { id: id },
            data: { channels: userTmp },
          });
          return channel;
      }
    catch (error) {
        console.log('error');
    }
 }

 async addUserToChannel(userId: string, channelId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
    let tmp : string[] = channel.users;
    let userChannels : string[] = user.channels;
    if (!tmp.includes(userId) && !channel.bannedUsers.includes(userId))
        userChannels.push(channelId);
        tmp.push(userId);
    if (user && channel) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { channels: userChannels },
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
    let tmpUser : string[] = [];
    let tmpChannel : string[] = [];
    let adminChannel: string[] = [];
    
    if (user && channel && channel.users.includes(userId)) {
        for (let index: number = 0; index < user.channels.length ; index++) {
          console.log(index);
          if (user.channels[index] != channelId)
            tmpUser.push(user.channels[index])
        }
        for (let index: number = 0; index < channel.users.length ; index++) {
          console.log(index); 
          if (channel.users[index] != userId)
            tmpChannel.push(channel.users[index])
        }
        if (channel.admins.includes(userId)) {
          for (let index: number = 0; index < channel.admins.length ; index++) {
            if (channel.admins[index] != userId)
              adminChannel.push(channel.admins[index])
          }
          await this.prisma.channel.update({
              where : {id : channelId},
              data : {admins : adminChannel},
          })
        }
        console.log(tmpUser);
        console.log(tmpChannel);
        await this.prisma.user.update({
            where: { id: userId },
            data : {channels : tmpUser},    
        },
        );
        await this.prisma.channel.update({
            where : {id : channelId},
            data : {users : tmpChannel},
        })
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

 async getChannelByName(channelName: string) : Promise<channelDto> {
    return await this.prisma.channel.findFirst({where : {name : channelName}});
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
