"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProvider = void 0;
const cloudinary_1 = require("cloudinary");
const constants_1 = require("./constants");
exports.CloudinaryProvider = {
    provide: constants_1.CLOUDINARY,
    useFactory: () => {
        return cloudinary_1.v2.config({
            cloud_name: 'dvmxfvju3',
            api_key: '479127925312421',
            api_secret: 'JUxXYMloO9Tg9VdidYDedw24QTo',
        });
    },
};
//# sourceMappingURL=cloudinary.provider.js.map