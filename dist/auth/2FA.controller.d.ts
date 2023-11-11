import { TwoFAService } from "./2FA.service";
import { Response } from "express";
import { UserDto } from "src/DTOs/User/user.dto";
import { UserService } from "./user.service";
export declare class TwoFAConroller {
    private readonly TwoFAService;
    private readonly userService;
    constructor(TwoFAService: TwoFAService, userService: UserService);
    register(response: Response, req: Request & {
        user: UserDto;
    }): Promise<void>;
    validate2FA(req: Request & {
        user: UserDto;
    }, code: string, res: Response): Promise<void>;
}
