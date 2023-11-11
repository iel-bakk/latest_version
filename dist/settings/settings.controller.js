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
exports.settingsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const users_repository_1 = require("../modules/users/users.repository");
const jwt_guard_1 = require("../auth/jwt.guard");
const setting_dto_1 = require("../DTOs/settings/setting.dto");
let settingsController = class settingsController {
    constructor(user, Cloudinary) {
        this.user = user;
        this.Cloudinary = Cloudinary;
    }
    async GetUserData(id) {
        return await this.user.getUserById(id);
    }
    async uploadFile(file, req) {
        let achievements = (await this.user.getUserById(req.user.id)).achievements;
        if (!achievements.includes('customize your avatar'))
            await this.user.updateAcheivement('customize your avatar', req.user.id);
        const tmp = await this.Cloudinary.uploadImage(file, req.user.id);
        console.log(tmp);
        const heha = await this.user.updateAvatar(req.user.id, tmp.url);
        console.log(heha);
    }
    async updateUsername(data, req) {
        console.log(`id : ${req.user.id}`);
        console.log(`username new : ${data}`);
        if (data.username != req.user.username)
            return await this.user.updateUsername(req.user.id, data.username);
    }
};
exports.settingsController = settingsController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], settingsController.prototype, "GetUserData", null);
__decorate([
    (0, common_1.Put)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], settingsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [setting_dto_1.settingsDto, Object]),
    __metadata("design:returntype", Promise)
], settingsController.prototype, "updateUsername", null);
exports.settingsController = settingsController = __decorate([
    (0, common_1.Controller)('Settings'),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository, cloudinary_service_1.CloudinaryService])
], settingsController);
//# sourceMappingURL=settings.controller.js.map