import { ConfigService } from "@nestjs/config";
declare const FortyTwoOauthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class FortyTwoOauthGuard extends FortyTwoOauthGuard_base {
    private configService;
    constructor(configService: ConfigService);
}
export {};
