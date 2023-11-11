import { MatchDto } from 'src/DTOs/Match/match.dto';
import { MatchesRepository } from 'src/modules/matches/matches.repository';
import { UsersRepository } from 'src/modules/users/users.repository';
export declare class GameController {
    private user;
    private games;
    constructor(user: UsersRepository, games: MatchesRepository);
    greetplayer(): Promise<MatchDto>;
    CreateGame(data: MatchDto): Promise<any>;
}
