"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModule = void 0;
const common_1 = require("@nestjs/common");
const achievement_repository_1 = require("../modules/achievement/achievement.repository");
const conversation_repository_1 = require("../modules/conversation/conversation.repository");
const prisma_service_1 = require("../modules/database/prisma.service");
const friends_repository_1 = require("../modules/friends/friends.repository");
const invites_repository_1 = require("../modules/invites/invites.repository");
const matches_repository_1 = require("../modules/matches/matches.repository");
const message_repository_1 = require("../modules/message/message.repository");
const users_repository_1 = require("../modules/users/users.repository");
const profile_controller_1 = require("./profile.controller");
const readfile_1 = require("../modules/readfile/readfile");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const user_service_1 = require("../auth/user.service");
let ProfileModule = class ProfileModule {
};
exports.ProfileModule = ProfileModule;
exports.ProfileModule = ProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [users_repository_1.UsersRepository, prisma_service_1.PrismaService, friends_repository_1.FriendsRepository, invites_repository_1.InvitesRepository, matches_repository_1.MatchesRepository, message_repository_1.messageRepository, conversation_repository_1.converationRepositroy, prisma_service_1.PrismaService, achievement_repository_1.AchievementRepository, readfile_1.FileService, cloudinary_service_1.CloudinaryService, user_service_1.UserService],
        controllers: [profile_controller_1.ProfileController]
    })
], ProfileModule);
//# sourceMappingURL=profile.module.js.map