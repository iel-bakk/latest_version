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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const friend_dto_1 = require("../DTOs/friends/friend.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const achievement_repository_1 = require("../modules/achievement/achievement.repository");
const friends_repository_1 = require("../modules/friends/friends.repository");
const matches_repository_1 = require("../modules/matches/matches.repository");
const readfile_1 = require("../modules/readfile/readfile");
const users_repository_1 = require("../modules/users/users.repository");
let ProfileController = class ProfileController {
    constructor(user, achievement, match, file, friend) {
        this.user = user;
        this.achievement = achievement;
        this.match = match;
        this.file = file;
        this.friend = friend;
    }
    async GetUserData(id) {
        const _achievements = await this.achievement.getAchievements();
        if (!_achievements.length)
            await this.achievement.CreateAchievment(this.file);
        const _matches = await this.match.findMatchesByUserId(id);
        let tmpUser = await this.user.getUserById(id);
        if (!tmpUser)
            return 'no such user.';
        let profileData = {
            userData: tmpUser,
            achievements: _achievements,
            matches: [],
        };
        profileData.matches = [];
        profileData.achievements.forEach((_achievement) => {
            if (profileData.userData.achievements.includes(_achievement.title)) {
                _achievement.unlocked = true;
            }
        });
        const tmpMatches = await Promise.all(_matches.map(async (match) => {
            let _playerAAvatar;
            let _playerBAvatar;
            let _playerAAUsername;
            let _playerBAUsername;
            if (match.playerAId == profileData.userData.id) {
                const tmpUser = await this.user.getUserById(match.playerBId);
                _playerAAUsername = profileData.userData.username;
                _playerAAvatar = profileData.userData.avatar;
                _playerBAUsername = tmpUser.username;
                _playerBAvatar = tmpUser.avatar;
            }
            else {
                const tmpUser = await this.user.getUserById(match.playerAId);
                _playerBAUsername = profileData.userData.username;
                _playerBAvatar = profileData.userData.avatar;
                _playerAAUsername = tmpUser.username;
                _playerAAvatar = tmpUser.avatar;
            }
            let tmp = {
                playerAId: match.playerAId,
                playerBId: match.playerBId,
                playerAScore: match.playerAScore,
                playerBScore: match.playerBScore,
                playerAAvatar: _playerAAvatar,
                playerBAvatar: _playerBAvatar,
                playerAUsername: _playerAAUsername,
                playerBUsername: _playerBAUsername,
            };
            try {
                return tmp;
            }
            catch (error) {
                console.log("error profile -> match");
                return null;
            }
        }));
        profileData.matches = tmpMatches.filter((match) => match !== null);
        console.log(profileData.matches);
        console.log(_achievements);
        return profileData;
    }
    async addFriend(data, req) {
        console.log(req.user);
        return this.friend.createFriend(data, req.user.id);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "GetUserData", null);
__decorate([
    (0, common_1.Post)('addFriend'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuth),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [friend_dto_1.FriendDto, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "addFriend", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)('Profile'),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        achievement_repository_1.AchievementRepository,
        matches_repository_1.MatchesRepository,
        readfile_1.FileService,
        friends_repository_1.FriendsRepository])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map