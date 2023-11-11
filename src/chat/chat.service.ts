import { Injectable } from '@nestjs/common';
import { channel } from 'diagnostics_channel';
import { UserDto } from 'src/DTOs/User/user.dto';
import { channelDto } from 'src/DTOs/channel/channel.dto';
import { PrismaService } from 'src/modules/database/prisma.service';

@Injectable()
export class ChannelsService {
 constructor(private prisma: PrismaService) {}

 async createChannel(channelData: channelDto , id : string) : Promise<any> {
    console.log(`the users id ${id}`);
    let tmp : string[] = [id];
    // try {
      let check : channelDto = await this.getChannelByName(channelData.name)
      let tmpUser : UserDto = await this.prisma.user.findUnique({where : {id : id}})
      if (check || !tmpUser)
        return
      console.log(channelData);
      let channel: channelDto = await this.prisma.channel.create({data : {
        name : channelData.name,
        admins : tmp,
        users : tmp,
        owner : tmpUser.id,
        IsPrivate : channelData.IsPrivate,
        IsProtected : channelData.IsProtected,
        password : channelData.password
      }})
      
      tmpUser.channels.push(channel.id);
          await this.prisma.user.update({
            where: { id: id },
            data: { channels: tmpUser.channels },
          });
          return channel;
      // }
      // catch (error) {
      //   console.log('error');
      // }
 }

 async addUserToChannel(userId: string, _channel : channelDto) {
  try {

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const channel = await this.prisma.channel.findUnique({ where: { id: _channel.id } });
    let tmp : string[] = [];
    let userChannels : string[] = [];
    if (user && channel && !tmp.includes(userId) && !channel.bannedUsers.includes(userId)) {
      if (channel.IsProtected && channel.password != _channel.password)
        return
      tmp  = channel.users;
      userChannels  = user.channels;
      userChannels.push(_channel.id);
      tmp.push(userId);
      await this.prisma.user.update({
        where: { id: userId },
        data: { channels: userChannels },
      });
      await this.prisma.channel.update({
        where : {id : _channel.id},
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
    
    if (user && channel && !channel.bannedUsers.includes(user.id)) {
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

 async unBanUserFromChannel(username : string, channelName : string) {
  let user : UserDto = await this.prisma.user.findFirst({where : {username : username}})
  let channel : channelDto = await this.prisma.channel.findUnique({where : {name : channelName}})
  let tmp : string[] = [];
  if (user && channel) {
    if (channel.bannedUsers.includes(user.id)) {
        for (let index = 0; index < channel.bannedUsers.length; index++) {
          if (user.id != channel.bannedUsers[index])
            tmp.push(channel.bannedUsers[index]);
        }
        console.log(tmp);
        await this.prisma.channel.update({where : {id : channel.id},
          data : {bannedUsers : tmp}})
        }
        await this.addUserToChannel(user.id, channel);
  }
 }

 async getChannelByName(channelName: string) : Promise<channelDto> {
    return await this.prisma.channel.findFirst({where : {name : channelName}});
 }
 async assignAdminToChannel(userName: string, channelName: string) {
    const user = await this.prisma.user.findFirst({ where: { username: userName } });
    const channel = await this.prisma.channel.findUnique({ where: { name: channelName } });
    if (user && channel && channel.users.includes(user.id) && !channel.admins.includes(user.id)) {
      console.log('ghehehe');
      
      channel.admins.push(user.id)
        await this.prisma.channel.update({where : {id : channel.id},
          data : {
            admins : channel.admins,
          }})
    }
 }

 async removeAdminPrivilageToUser(username : string, channelName : string) {
    let channel : channelDto = await this.getChannelByName(channelName);
    let user : UserDto = await this.prisma.user.findFirst({where : {username : username}})
    let tmp : string[] = []

    if (user && channel) {
      if (channel.admins.includes(user.id) && user.id != channel.owner)
      {
        for (let index = 0; index < channel.admins.length; index++) {
          if (user.id != channel.admins[index])
            tmp.push(channel.admins[index])
        }
        await this.prisma.channel.update({where : {id : channel.id} , 
        data : {admins : tmp}})
      }
    }
 }

 async deleteChannel(channelId : string) {
    await this.prisma.channel.delete({where : {id : channelId}})
 }
//  async setPasswordToChannel(password: string, channelName : string) {
//     let channel : channelDto = await this.getChannelByName(channelName)
//     if (channel) {
//       await this.prisma.channel.update({where : {id: channel.id},
//       data : { 

//       }})
//     }
//  }
 }
