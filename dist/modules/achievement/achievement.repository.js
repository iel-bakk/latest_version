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
exports.AchievementRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let AchievementRepository = class AchievementRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async CreateAchievment(file) {
        const achievements = [
            {
                title: 'play your first game',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322232/umkxxvgtxbe2bowynp8v.png',
            },
            {
                title: 'add your first friend',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323498/kncbovhc1fbuqkilrgjm.png',
            },
            {
                title: 'win a game',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322378/qdat4wgumpjsvbtcisd6.png',
            },
            {
                title: 'play 3 games',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322411/fuentssbawcfsdbzgvzu.png',
            },
            {
                title: 'reach level 10',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323588/f535f2mtj54fjeejkb7t.png',
            },
            {
                title: 'get 10 friends',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322969/drbaiumfsn0dp6ij908s.png',
            },
            {
                title: 'send your first message',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322994/vp6r4ephqymsyrzxgd0h.png',
            },
            {
                title: 'join your first channel',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323498/kncbovhc1fbuqkilrgjm.png',
            },
            {
                title: 'create your first channel',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699323620/qodwzbr6cxd74m14i4ad.png',
            },
            {
                title: 'customize your avatar',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322922/ds3v9fsgo1dlujvh8otp.png',
            },
            {
                title: 'play 100 games',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322889/mmgus4h0unnnj3lvhw2v.png',
            },
            {
                title: 'play 10 games',
                unlocked: false,
                icon: 'https://res.cloudinary.com/dvmxfvju3/image/upload/v1699322764/ixv9svidceql0yox2ils.png',
            },
        ];
        achievements.forEach(async (data) => {
            await this.prisma.achievement.create({ data });
            console.log(data);
        });
        return achievements;
    }
    async getAchievements() {
        return await this.prisma.achievement.findMany();
    }
};
exports.AchievementRepository = AchievementRepository;
exports.AchievementRepository = AchievementRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AchievementRepository);
//# sourceMappingURL=achievement.repository.js.map