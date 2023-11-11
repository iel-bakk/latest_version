import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
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
    async createChannel(@Body() channelData : channelDto, @Req() req: Request & {user : UserDto} ) : Promise<any> {
        return await this.channel.createChannel(channelData, req.user.id);
    }

    @Post('ChannelAddUser')
    @UseGuards(JwtAuth)
    async addUserToChannel(@Body('channelName') channelName : string, @Body('username') username : string, @Req() req : Request & {user : UserDto}) {
        let channel : channelDto = await this.channel.getChannelByName(channelName);
        let tmpUser : UserDto = await this.user.getUserByUsername(username);
        if (tmpUser && channel) {
            console.log(channel);
            console.log(tmpUser);
            await this.channel.addUserToChannel(tmpUser.id, channel.id);
        }
    }
    

    @Delete('removeUserFromChannel')
    @UseGuards(JwtAuth)
    async removeUserFromChannel(@Req() req: Request & {user : UserDto}, @Body('username') username: string, @Body('channelName') channelName: string) {
        console.log(`username recieved from body : ${username}`);
        let tmpUser: UserDto = await this.user.getUserByUsername(username)
        let  tmpchannel : channelDto = await this.channel.getChannelByName(channelName)
        console.log(`user to delete : `, tmpUser);
        console.log(`channel : `, tmpchannel);
        try {

            if ( tmpUser && tmpchannel && tmpchannel.admins.includes(req.user.id) && tmpchannel.users.includes(tmpUser.id))
            {
                await this.channel.removeUserFromChannel(tmpUser.id, tmpchannel.id);
            }
        }
        catch (error) {
            console.log(`could not delete the user`);
        }
    }

    @Post('BanUserFromChannel')
    @UseGuards(JwtAuth)
    async   banUserFromChannel(@Req() req: Request & {user : UserDto}, @Body('username') username: string, @Body('channelName') channelName: string) {
        let channelTmp : channelDto = await this.channel.getChannelByName(channelName)
        if (channelTmp && channelTmp.admins.includes(req.user.id)) {
            await this.channel.banUserFromChannel(username, channelName);
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
}