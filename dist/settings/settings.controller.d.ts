/// <reference types="multer" />
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UsersRepository } from 'src/modules/users/users.repository';
import { Request } from 'express';
import { UserDto } from 'src/DTOs/User/user.dto';
import { settingsDto } from 'src/DTOs/settings/setting.dto';
export declare class settingsController {
    private user;
    private Cloudinary;
    constructor(user: UsersRepository, Cloudinary: CloudinaryService);
    GetUserData(id: string): Promise<UserDto>;
    uploadFile(file: Express.Multer.File, req: Request & {
        user: UserDto;
    }): Promise<void>;
    updateUsername(data: settingsDto, req: Request & {
        user: UserDto;
    }): Promise<any>;
}
