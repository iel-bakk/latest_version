import { UserDto } from "src/DTOs/User/user.dto";
import { FriendDto } from "src/DTOs/friends/friend.dto";
import { InviteDto } from "src/DTOs/invitation/invite.dto";
import { converationRepositroy } from "src/modules/conversation/conversation.repository";
import { FriendsRepository } from "src/modules/friends/friends.repository";
import { InvitesRepository } from "src/modules/invites/invites.repository";
import { UsersRepository } from "src/modules/users/users.repository";
import { ChannelsService } from "./chat.service";
import { channelDto } from "src/DTOs/channel/channel.dto";
export declare class ChatController {
    private conversation;
    private user;
    private invite;
    private friend;
    private channel;
    constructor(conversation: converationRepositroy, user: UsersRepository, invite: InvitesRepository, friend: FriendsRepository, channel: ChannelsService);
    check(): Promise<void>;
    SendInvitation(invitation: InviteDto, req: Request & {
        user: UserDto;
    }): Promise<InviteDto | string>;
    createChannel(channelData: channelDto, req: Request & {
        user: UserDto;
    }): Promise<any>;
    addUserToChannel(channelName: channelDto, username: string, req: Request & {
        user: UserDto;
    }): Promise<void>;
    removeUserFromChannel(req: Request & {
        user: UserDto;
    }, username: string, channelName: string): Promise<void>;
    banUserFromChannel(req: Request & {
        user: UserDto;
    }, username: string, channelName: string): Promise<void>;
    unBanUserFromChannel(req: Request & {
        user: UserDto;
    }, username: string, channelName: string): Promise<void>;
    accepteInvite(req: Request & {
        user: UserDto;
    }, invite: InviteDto): Promise<FriendDto | string>;
    addAdminToChannel(req: Request & {
        user: UserDto;
    }, username: string, channelName: string): Promise<void>;
    removeAdminFromChannel(req: Request & {
        user: UserDto;
    }, username: string, channelName: string): Promise<void>;
}
