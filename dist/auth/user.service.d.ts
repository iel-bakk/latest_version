import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/DTOs/User/user.dto";
import { PrismaService } from "src/modules/database/prisma.service";
export declare class UserService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    getallUsers(): Promise<UserDto[]>;
    getUser(id: string): Promise<UserDto | null>;
    getgoogleUser(id: string): Promise<UserDto | null>;
    createUser(data: UserDto): Promise<UserDto>;
    updateUser(id: string, data: UserDto): Promise<UserDto>;
    deleteUser(id: string): Promise<UserDto>;
    sign(id: string, username: string): Promise<string>;
    set2FaScret(secret: string, id: string): Promise<UserDto>;
}
