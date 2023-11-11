import { ConfigService } from "@nestjs/config";
declare const GoogleGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class GoogleGuard extends GoogleGuard_base {
    private configSrvice;
    constructor(configSrvice: ConfigService);
}
export {};
