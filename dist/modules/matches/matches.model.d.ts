import { UserDto } from "src/DTOs/User/user.dto";
export declare class MatchModel {
    id: string;
    playerAId: string;
    playerBId: string;
    playerA: UserDto;
    playerB: UserDto;
    playerAScore: number;
    playerBScore: number;
}
