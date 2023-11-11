import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
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