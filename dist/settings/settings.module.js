"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModule = void 0;
const common_1 = require("@nestjs/common");
const achievement_repository_1 = require("../modules/achievement/achievement.repository");
const conversation_repository_1 = require("../modules/conversation/conversation.repository");
const prisma_service_1 = require("../modules/database/prisma.service");
const friends_repository_1 = require("../modules/friends/friends.repository");
const invites_repository_1 = require("../modules/invites/invites.repository");
const matches_repository_1 = require("../modules/matches/matches.repository");
const message_repository_1 = require("../modules/message/message.repository");
const users_repository_1 = require("../modules/users/users.repository");
const settings_controller_1 = require("./settings.controller");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const user_service_1 = require("../auth/user.service");
let SettingsModule = class SettingsModule {
};
exports.SettingsModule = SettingsModule;
exports.SettingsModule = SettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [users_repository_1.UsersRepository, prisma_service_1.PrismaService, friends_repository_1.FriendsRepository, invites_repository_1.InvitesRepository, matches_repository_1.MatchesRepository, message_repository_1.messageRepository, conversation_repository_1.converationRepositroy, prisma_service_1.PrismaService, achievement_repository_1.AchievementRepository, cloudinary_service_1.CloudinaryService, jwt_guard_1.JwtAuth, user_service_1.UserService],
        controllers: [settings_controller_1.settingsController],
    })
], SettingsModule);
//# sourceMappingURL=settings.module.js.map