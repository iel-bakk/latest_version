"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFAService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_service_1 = require("./user.service");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
let TwoFAService = class TwoFAService {
    constructor(userService, configService) {
        this.userService = userService;
        this.configService = configService;
    }
    async generate2FASecret(data) {
        var user = await this.userService.getUser(data.username);
        if (!user)
            throw new common_1.UnauthorizedException('Invald data !!');
        if (!user.TwoFASecret) {
            var secret = otplib_1.authenticator.generateSecret();
            await this.userService.set2FaScret(secret, data.username);
            console.log(`secret : ${secret}`);
        }
        else
            secret = user.TwoFASecret;
        const otpuri = otplib_1.authenticator.keyuri(user.username, process.env.TWO_FACTOR_AUTH_APP_NAME, secret);
        const qrImg = await (0, qrcode_1.toDataURL)(otpuri);
        console.log(qrImg);
        return qrImg;
    }
    async TwoFACodeValidation(qrcode, secret) {
        const ret = otplib_1.authenticator.verify({
            token: qrcode,
            secret: secret
        });
        return ret;
    }
};
exports.TwoFAService = TwoFAService;
exports.TwoFAService = TwoFAService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService, config_1.ConfigService])
], TwoFAService);
//# sourceMappingURL=2FA.service.js.map