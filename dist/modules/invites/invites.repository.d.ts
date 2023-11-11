import { PrismaService } from 'src/modules/database/prisma.service';
import { InviteDto } from 'src/DTOs/invitation/invite.dto';
export declare class InvitesRepository {
    private prisma;
    constructor(prisma: PrismaService);
    createInvite(data: InviteDto): Promise<InviteDto | null>;
    getInvite(id: string): Promise<InviteDto>;
    deleteInvite(_id: string): Promise<string>;
}
