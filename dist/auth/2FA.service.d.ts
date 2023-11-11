import { ConfigService } from "@nestjs/config";
import { UserDto } from "src/DTOs/User/user.dto";
import { UserService } from "./user.service";
export declare class TwoFAService {
    private readonly userService;
    private readonly configService;
    constructor(userService: UserService, configService: ConfigService);
    generate2FASecret(data: UserDto): Promise<string>;
    TwoFACodeValidation(qrcode: string, secret: string): Promise<boolean>;
}
