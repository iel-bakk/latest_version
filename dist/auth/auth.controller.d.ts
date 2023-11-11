import { Request, Response } from "express";
import { UserDto } from "src/DTOs/User/user.dto";
import { UserService } from "./user.service";
export declare class AuthController {
    private userService;
    constructor(userService: UserService);
    fortytwoAuth(req: Request): Promise<void>;
    GoogleAuth(req: Request): Promise<void>;
    fortytwoAuthCallback(req: Request & {
        user: UserDto;
    }, res: Response): Promise<void>;
    GoogleCallBack(req: Request & {
        user: UserDto;
    }, res: Response): Promise<void>;
    home(req: Request & {
        user: UserDto;
    }): Promise<void>;
}
