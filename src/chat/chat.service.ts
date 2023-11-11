import { Injectable } from '@nestjs/common';
import { log } from 'console';
import { UserDto } from 'src/DTOs/User/user.dto';
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
      let tmpUser : UserDto = await this.prisma.user.findUnique({where : {id : id}})
      if (check || !tmpUser)
        return
      let channel: channelDto = await this.prisma.channel.create({data : {
        name : channelData.name,
        admins : tmp,
        users : tmp,
      }})
      tmpUser.channels.push(channel.id);
          await this.prisma.user.update({
            where: { id: id },
            data: { channels: tmpUser.channels },
          });
          return channel;
      }
    catch (error) {
        console.log('error');
    }
 }

 async addUserToChannel(userId: string, channelId: string) {
  try {

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
    let tmp : string[] = [];
    let userChannels : string[] = [];
    if (user && channel && !tmp.includes(userId) && !channel.bannedUsers.includes(userId)) {
      tmp  = channel.users;
      userChannels  = user.channels;
      userChannels.push(channelId);
      tmp.push(userId);
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
  catch (error) {
    console.log(`no such user or channel`);
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
          if (adminChannel.length == 0)
            adminChannel = [];
          await this.prisma.channel.update({
              where : {id : channelId},
              data : {admins : adminChannel},
          })
        }
        console.log(tmpUser);
        console.log(tmpChannel);
        if (tmpUser.length == 0)
          tmpUser = []
        if (tmpChannel.length == 0)
          tmpChannel = []
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

 async banUserFromChannel(username: string, channelName: string) {
    const user : UserDto = await this.prisma.user.findFirst({ where: { username: username } });
    const channel : channelDto = await this.prisma.channel.findUnique({ where: { name: channelName } });
    let Ban : string[];
    console.log(channel);
    
    if (user && channel) {
      console.log("testing");
      Ban = channel.bannedUsers;
      await this.removeUserFromChannel(user.id, channel.id);
      Ban.push(user.id);
      console.log(Ban);
      await this.prisma.channel.update({
        where: { id: channel.id },
        data: { bannedUsers: Ban } },
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
