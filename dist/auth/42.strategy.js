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
exports.OAuth = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
let OAuth = class OAuth extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor() {
        super({
            clientID: process.env.CLIENT_ID_42,
            clientSecret: process.env.CLIENT_SECRET_42,
            callbackURL: "http://localhost:5000/auth/42/callback",
            profileFields: {
                'id': 'id',
                'username': 'login',
                'displayName': 'displayname',
                'name.familyName': 'last_name',
                'name.givenName': 'first_name',
                'emails.0.value': 'email',
            }
        });
    }
    async validate(accesToken, refreshToken, profile, done) {
        const { id, email, login } = profile._json;
        const user = {
            id: String(id),
            username: login,
            email: email,
        };
        done(null, user);
    }
};
exports.OAuth = OAuth;
exports.OAuth = OAuth = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OAuth);
//# sourceMappingURL=42.strategy.js.map