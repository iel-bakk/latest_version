import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserDto } from "src/DTOs/User/user.dto";
import { FriendDto } from "src/DTOs/friends/friend.dto";
import { InviteDto } from "src/DTOs/invitation/invite.dto";
import { JwtAuth } from "src/auth/jwt.guard";
import { converationRepositroy } from "src/modules/conversation/conversation.repository";
import { FriendsRepository } from "src/modules/friends/friends.repository";
import { InvitesRepository } from "src/modules/invites/invites.repository";
import { UsersRepository } from "src/modules/users/users.repository";
import { ChannelsService } from "./chat.service";
import { channelDto } from "src/DTOs/channel/channel.dto";
import { Request } from "express";
import { channelMessageDto } from "src/DTOs/channel/channel.messages.dto";
import { channelParams } from "src/DTOs/channel/channel.params.dto";
import { ConversationDto } from "src/DTOs/conversation/conversation.dto";
import { chatDto } from "src/DTOs/chat/chat.dto";
import { frontData } from "src/DTOs/chat/conversation.dto";
import { messageDto } from "src/DTOs/message/message.dto";
import { messageRepository } from "src/modules/message/message.repository";

@Controller('Chat')
export class ChatController {
    constructor (private conversation: converationRepositroy
                , private user : UsersRepository
                , private invite : InvitesRepository
                , private friend: FriendsRepository
                , private channel : ChannelsService
                , private message: messageRepository) {}

    @Get()
    @UseGuards(JwtAuth)
    async getUserMessages(@Req() req: Request & {user : UserDto}) :Promise<any> {
        let _user : UserDto = await this.user.getUserById(req.user.id)
        let data : frontData[] = [];
        if (_user) {
            let conversations : ConversationDto[] = await this.conversation.getConversations(_user.id)
            if  (conversations) {
                // conversations.forEach( async (conversation) => {
                    for (let index : number = 0; index < conversations.length; index++) {
                    let tmp : frontData = new frontData;
                    let _sender : UserDto = await this.user.getUserById(conversations[index].senderId)
                    let _reciever : UserDto = await this.user.getUserById(conversations[index].recieverId)
                    if (_sender && _reciever) {
                        tmp.Conversationid = conversations[index].id   
                        tmp.avatar = (_user.id == _sender.id) ? _reciever.avatar : _sender.avatar;
                        tmp.username = (_user.id == _sender.id) ? _reciever.username : _sender.username;
                        tmp.online = false;
                        tmp.messages = await this.message.getMessages(conversations[index], req.user.id)
                        tmp.lastMesasge = ''
                        data.push(tmp)
                        console.log(tmp);
                    }
                }
            }
            console.log(data);
            return data
        }
    }

    @Post('invite')
    @UseGuards(JwtAuth)
    async SendInvitation(@Body() invitation : InviteDto, @Req() req: Request & {user : UserDto}) : Promise<InviteDto | string> {
        if (req.user.id != invitation.invitationSenderId || req.user.id == invitation.invitationRecieverId)
            return "Sir tel3eb";
        let tmp = await this.invite.createInvite(invitation);
        if (tmp == null)
            return `Already Friends`;
        return tmp as InviteDto;
    }

    @Post('createChannel')
    @UseGuards(JwtAuth)
    async createChannel(@Body() channelData : channelDto, @Req() req: Request & {user : UserDto}) : Promise<any> {
            console.log(channelData);
            if ((channelData.IsPrivate && channelData.IsProtected) || (channelData.IsPrivate && channelData.password.length))
                return `can't have private channel with password.`
            if (channelData.IsProtected && channelData.password.length == 0)
                return `can't have empty passwords on protected chat rooms`
            if (!channelData.IsProtected && channelData.password.length)
                return `can't set password to none protected chat rooms`

            let test : channelDto = await this.channel.createChannel(channelData, req.user.id);
            console.log(test);
            return 'channel created succefuly'
    }


    @Post('BanUser')
    @UseGuards(JwtAuth)
    async   BanUser(@Req() req: Request & {user : UserDto} , @Body('username') username: string) : Promise<string> {
        let userToBan : UserDto = await this.user.getUserByUsername(username)
        let requester : UserDto = await this.user.getUserById(req.user.id)
        if (userToBan && requester && !requester.bandUsers.includes(userToBan.id)) {
            return await this.channel.BanUser(req.user, userToBan)
        }
        else
            return `user dosen't exist in database .`
    }
    
    @Post('unBanUser')
    @UseGuards(JwtAuth)
    async   unBanUser(@Req() req: Request & {user : UserDto} , @Body('username') username: string) : Promise<string> {
        let userTounBan : UserDto = await this.user.getUserByUsername(username)
        let requester : UserDto = await this.user.getUserById(req.user.id)
        if (userTounBan && requester && requester.bandUsers.includes(userTounBan.id)) {
            return await this.channel.unBanUser(req.user, userTounBan)
        }
        else
            return `user dosen't exist in database .`
    }



    @Post('ChannelAddUser')
    @UseGuards(JwtAuth)
    async addUserToChannel(@Body() channelName: channelDto, @Body('username') username : string, @Req() req : Request & {user : UserDto}) {
            let channel : channelDto = await this.channel.getChannelByName(channelName.name);
            let tmpUser : UserDto = await this.user.getUserByUsername(username);
            if (tmpUser && channel) {
                channel.password = channelName.password;
                if (channel.IsPrivate && req.user.id == channel.owner) {
                    await this.channel.addUserToChannel(tmpUser.id, channel);
                }
                else if (!channel.IsPrivate) {
                    await this.channel.addUserToChannel(tmpUser.id, channel);
                }
            }
        }
    

    @Delete('removeUserFromChannel')
    @UseGuards(JwtAuth)
    async removeUserFromChannel(@Req() req: Request & {user : UserDto}, @Body() data: channelParams) {
        console.log(`username recieved from body : ${data.username}`);
        let tmpUser: UserDto = await this.user.getUserByUsername(data.username)
        let  tmpchannel : channelDto = await this.channel.getChannelByName(data.channelName)
        console.log(`user to delete : `, tmpUser);
        console.log(`channel : `, tmpchannel);
            if ( tmpUser && tmpchannel && tmpchannel.admins.includes(req.user.id) && tmpchannel.users.includes(tmpUser.id))
            {
                if (tmpUser.id == tmpchannel.owner && req.user.id == tmpchannel.owner)
                    await this.channel.removeUserFromChannel(tmpUser.id, tmpchannel.id);
                else if (tmpUser.id != tmpchannel.owner)
                    await this.channel.removeUserFromChannel(tmpUser.id, tmpchannel.id);
                let check : channelDto = await this.channel.getChannelByName(data.channelName)
                if (check && !check.users.length)
                    await this.channel.deleteChannel(check.id);
                console.log(check.users)
            }
    }

    @Post('BanUserFromChannel')
    @UseGuards(JwtAuth)
    async   banUserFromChannel(@Req() req: Request & {user : UserDto}, @Body() data: channelParams) {
            let channelTmp : channelDto = await this.channel.getChannelByName(data.channelName)
            let userTmp : UserDto = await this.user.getUserByUsername(data.username)
            if (channelTmp && userTmp && channelTmp.admins.includes(req.user.id)) {
                if (userTmp.id == channelTmp.owner && userTmp.id == req.user.id)
                await this.channel.banUserFromChannel(data.username, data.channelName);
            else if (userTmp.id != channelTmp.owner)
            await this.channel.banUserFromChannel(data.username, data.channelName);
            }
    }
    
    @Post('unBanUserFromChannel')
    @UseGuards(JwtAuth)
    async   unBanUserFromChannel(@Req() req: Request & {user : UserDto}, @Body() data: channelParams) {
            let channelTmp : channelDto = await this.channel.getChannelByName(data.channelName)
            let userTmp : UserDto = await this.user.getUserByUsername(data.username)
            if (channelTmp && userTmp && channelTmp.admins.includes(req.user.id) && channelTmp.bannedUsers.includes(userTmp.id)) {
                await this.channel.unBanUserFromChannel(data.username, data.channelName);
            }
    }

    @Put('accepteInvite')
    @UseGuards(JwtAuth)
    async accepteInvite(@Req() req: Request & {user : UserDto}, @Body() invite : InviteDto) : Promise<FriendDto | string> {
        if (req.user.id != invite.invitationRecieverId)
            return 'Unauthorized !!'
        let tmp : InviteDto = await this.invite.getInvite(invite.id);
        if (!tmp)
            return 'no Invite to accepte'
        await this.invite.deleteInvite(invite.id);
        return this.friend.createFriend(new FriendDto(invite.invitationRecieverId, invite.invitationSenderId, ''), req.user.id);
    }
    

    @Post('addAdminToChannel')
    @UseGuards(JwtAuth)
    async   addAdminToChannel(@Req() req : Request & {user : UserDto},  @Body() data: channelParams) {
        let _user : UserDto = await this.user.getUserByUsername(data.username)
        if (_user)
            await this.channel.assignAdminToChannel(_user, data.channelName);
    }
    
    
    @Post('removeAdminToChannel')
    @UseGuards(JwtAuth)
    async   removeAdminFromChannel(@Req() req : Request & {user : UserDto},  @Body() data: channelParams) {
        let channel : channelDto = await this.channel.getChannelByName(data.channelName)
        let userTmp : UserDto = await this.user.getUserByUsername(data.username)
        if (userTmp && channel && channel.admins.includes(req.user.id)) {
            if (channel.owner == userTmp.id && req.user.id == channel.owner)
            await this.channel.removeAdminPrivilageToUser(data.username, data.channelName);
        else if (channel.owner != userTmp.id)
        await this.channel.removeAdminPrivilageToUser(data.username, data.channelName);
    }
}

    @UseGuards(JwtAuth)
    @Post('addPasswordToChannel')
    async addPasswordToChannel(@Body() channleData : channelDto, @Req() req: Request & {user : UserDto}) {
            let channel : channelDto = await this.channel.getChannelByName(channleData.name)
            if (channel && channel.owner == req.user.id) {
                await this.channel.setPasswordToChannel(channleData.password, channleData.name)
            }
    }
    
    @UseGuards(JwtAuth)
    @Post('removePasswordToChannel')
    async removePasswordToChannel(@Body() data : channelParams , @Req() req: Request & {user : UserDto}) {
        let channel : channelDto = await this.channel.getChannelByName(data.channelName)
        if (channel && channel.owner == req.user.id) {
            await this.channel.unsetPasswordToChannel(data.channelName)
        }
    }


    @Post('getChannelMessages')
    @UseGuards(JwtAuth)
    async   getChannelMessages(@Body() data : channelParams, @Req() req: Request & {user : UserDto}) : Promise<channelMessageDto[] | null>{
        let check_channel : channelDto = await this.channel.getChannelByName(data.channelName)
        if (check_channel && check_channel.users.includes(req.user.id))
            return await this.channel.getChannelMessages(data.channelName)
        return null
    }
}