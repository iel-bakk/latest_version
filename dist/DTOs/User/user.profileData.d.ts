import { UserDto } from "./user.dto";
import { AchievementDto } from "../achievement/achievement.dto";
import { matchModel } from "../Match/match.model";
export declare class UserData {
    userData: UserDto;
    matches: matchModel[];
    achievements: AchievementDto[];
}
