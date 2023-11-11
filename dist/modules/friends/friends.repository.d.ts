import { PrismaService } from 'src/modules/database/prisma.service';
import { FriendDto } from 'src/DTOs/friends/friend.dto';
import { UsersRepository } from '../users/users.repository';
export declare class FriendsRepository {
    private prisma;
    private user;
    constructor(prisma: PrismaService, user: UsersRepository);
    createFriend(data: FriendDto, _id: string): Promise<FriendDto>;
    getFriends(_id: string): Promise<FriendDto[]>;
    updateFriend(id: string, data: FriendDto): Promise<FriendDto>;
    deleteFriend(id: string): Promise<string>;
}
