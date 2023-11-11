import { MatchDto } from 'src/DTOs/Match/match.dto';
import { UserDto } from 'src/DTOs/User/user.dto';
import { PrismaService } from 'src/modules/database/prisma.service';
import { UsersRepository } from '../users/users.repository';
export declare class MatchesRepository {
    private prisma;
    private user;
    constructor(prisma: PrismaService, user: UsersRepository);
    CreateMatch(playerA: UserDto, playerB: UserDto, _playerAScore: number, _playerBScore: number): Promise<MatchDto>;
    GetMatches(): Promise<MatchDto[]>;
    findMatchesByUserId(id: string): Promise<MatchDto[]>;
    CheckForGamesAchievements(matches: MatchDto[], _id: string): Promise<any>;
}
