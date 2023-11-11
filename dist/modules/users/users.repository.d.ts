import { PrismaService } from 'src/modules/database/prisma.service';
import { UserDto } from 'src/DTOs/User/user.dto';
export declare class UsersRepository {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(params: {
        data: UserDto;
    }): Promise<UserDto>;
    getUserById(playerId: string): Promise<UserDto | null>;
    getUserByUsername(username: string): Promise<UserDto | null>;
    updateAvatar(id: string, _avatar: string): Promise<UserDto>;
    updateUsername(id: string, _username: string): Promise<any>;
    updateAcheivement(_title: string, id: string): Promise<UserDto>;
    deleteUser(id: string): Promise<string>;
}
