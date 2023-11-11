import { Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
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
import { Response } from "express";

@Controller('Chat')
export class ChatController {
    constructor (private conversation: converationRepositroy, private user : UsersRepository, private invite : InvitesRepository, private friend: FriendsRepository, private channel : ChannelsService) {}
    @Get()
    async check() {
        let tmp = await this.conversation.numberOfConversations('98861')
        console.log(tmp);
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
    async createChannel(@Body() channelData : channelDto, @Req() req: Request & {user : UserDto}, @Res() res : Response) : Promise<any> {
        try {
            return await this.channel.createChannel(channelData, req.user.id);
        }
        catch (error) {
            res.status(400).json({message: 'invalid request .'})
            console.log('invalid data in request');
        }
    }

    @Post('ChannelAddUser')
    @UseGuards(JwtAuth)
    async addUserToChannel(@Body() channelName: channelDto, @Body('username') username : string, @Req() req : Request & {user : UserDto}, @Res() res: Response) {
        try {

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
        catch (error) {
            res.status(400).json({message: 'invalid request .'})
        }
        }
    

    @Delete('removeUserFromChannel')
    @UseGuards(JwtAuth)
    async removeUserFromChannel(@Req() req: Request & {user : UserDto}, @Body('username') username: string, @Body('channelName') channelName: string, @Res() res: Response) {
        console.log(`username recieved from body : ${username}`);
        let tmpUser: UserDto = await this.user.getUserByUsername(username)
        let  tmpchannel : channelDto = await this.channel.getChannelByName(channelName)
        console.log(`user to delete : `, tmpUser);
        console.log(`channel : `, tmpchannel);
        try {

            if ( tmpUser && tmpchannel && tmpchannel.admins.includes(req.user.id) && tmpchannel.users.includes(tmpUser.id))
            {
                if (tmpUser.id == tmpchannel.owner && req.user.id == tmpchannel.owner)
                    await this.channel.removeUserFromChannel(tmpUser.id, tmpchannel.id);
                else if (tmpUser.id != tmpchannel.owner)
                    await this.channel.removeUserFromChannel(tmpUser.id, tmpchannel.id);
                let check : channelDto = await this.channel.getChannelByName(channelName)
                if (check && !check.users.length)
                    await this.channel.deleteChannel(check.id);
                console.log(check.users)
            }
        }
        catch (error) {
            res.status(400).json({message: 'invalid request .'})
            console.log(`could not delete the user`);
        }
    }

    @Post('BanUserFromChannel')
    @UseGuards(JwtAuth)
    async   banUserFromChannel(@Req() req: Request & {user : UserDto}, @Body('username') username: string, @Body('channelName') channelName: string, @Res() res: Response) {
        try {

            let channelTmp : channelDto = await this.channel.getChannelByName(channelName)
            let userTmp : UserDto = await this.user.getUserByUsername(username)
            if (channelTmp && userTmp && channelTmp.admins.includes(req.user.id)) {
                if (userTmp.id == channelTmp.owner && userTmp.id == req.user.id)
                await this.channel.banUserFromChannel(username, channelName);
            else if (userTmp.id != channelTmp.owner)
            await this.channel.banUserFromChannel(username, channelName);
    }
    }
    catch (error) {
        res.status(400).json({message: 'invalid request .'})
    }
    }
    
    @Post('unBanUserFromChannel')
    @UseGuards(JwtAuth)
    async   unBanUserFromChannel(@Req() req: Request & {user : UserDto}, @Body('username') username: string, @Body('channelName') channelName: string, @Res() res: Response) {
        try {

            let channelTmp : channelDto = await this.channel.getChannelByName(channelName)
            let userTmp : UserDto = await this.user.getUserByUsername(username)
            if (channelTmp && userTmp && channelTmp.admins.includes(req.user.id) && channelTmp.bannedUsers.includes(userTmp.id)) {
                await this.channel.unBanUserFromChannel(username, channelName);
            }
        }
        catch (error) {
            res.status(400).json({message: 'invalid request .'})
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
    async   addAdminToChannel(@Req() req : Request & {user : UserDto}, @Body('username') username : string, @Body('channelName') channelName: string, @Res() res: Response) {
        try {
            await this.channel.assignAdminToChannel(username, channelName);
        }
        catch (error) {
            res.status(400).json({message: 'invalid request .'})
        }
    }
    
    
    @Post('removeAdminToChannel')
    @UseGuards(JwtAuth)
    async   removeAdminFromChannel(@Req() req : Request & {user : UserDto}, @Body('username') username : string, @Body('channelName') channelName: string, @Res() res: Response) {
        try {

            let channel : channelDto = await this.channel.getChannelByName(channelName)
            let userTmp : UserDto = await this.user.getUserByUsername(username)
            if (userTmp && channel && channel.admins.includes(req.user.id)) {
                if (channel.owner == userTmp.id && req.user.id == channel.owner)
                await this.channel.removeAdminPrivilageToUser(username, channelName);
            else if (channel.owner != userTmp.id)
            await this.channel.removeAdminPrivilageToUser(username, channelName);
        }
        }
        catch (error) {
            res.status(400).json({message: 'invalid request .'})
        }
}

    @UseGuards(JwtAuth)
    @Post('addPasswordToChannel')
    async addPasswordToChannel(@Body() channleData : channelDto, @Req() req: Request & {user : UserDto}, @Res() res: Response) {
        try {

            let channel : channelDto = await this.channel.getChannelByName(channleData.name)
            if (channel && channel.owner == req.user.id) {
                await this.channel.setPasswordToChannel(channel.password, channleData.name)
            }
        }
        catch (error) {
            res.status(400).json({message: 'invalid request .'})
        }
    }

}