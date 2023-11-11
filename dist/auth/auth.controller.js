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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const _42_oauth_guard_1 = require("./42-oauth.guard");
const jwt_guard_1 = require("./jwt.guard");
const google_OAuth_guard_1 = require("./google.OAuth.guard");
const user_service_1 = require("./user.service");
let AuthController = class AuthController {
    constructor(userService) {
        this.userService = userService;
    }
    async fortytwoAuth(req) { }
    async GoogleAuth(req) { }
    async fortytwoAuthCallback(req, res) {
        console.log(`login : ${req.user.username}`);
        const user = await this.userService.createUser(req.user);
        const token = await this.userService.sign(user.id, user.username);
        res.cookie('jwt-token', token, {
            expires: new Date(Date.now() + 900000000),
            httpOnly: true
        });
        console.log(`token : ${token}`);
        res.redirect(`http://localhost:5000/auth/home`);
    }
    async GoogleCallBack(req, res) {
        const user = await this.userService.createUser(req.user);
        console.log(user);
        const token = await this.userService.sign(user.id, user.username);
        res.cookie('jwt-token', token, {
            expires: new Date(Date.now() * 1000),
            httpOnly: true
        });
        res.redirect(`http://localhost:5000/auth/home`);
    }
    async home(req) {
        console.log(req.user);
        return;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('42'),
    (0, common_1.UseGuards)(_42_oauth_guard_1.FortyTwoOauthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "fortytwoAuth", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)(google_OAuth_guard_1.GoogleGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "GoogleAuth", null);
__decorate([
    (0, common_1.Get)('42/callback'),
    (0, common_1.UseGuards)(_42_oauth_guard_1.FortyTwoOauthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "fortytwoAuthCallback", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)(google_OAuth_guard_1.GoogleGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "GoogleCallBack", null);
__decorate([
    (0, common_1.Get)('home'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "home", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map