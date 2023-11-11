export declare class AppService {
    fortytwoLogin(req: any): "No user from 42" | {
        message: string;
        user: any;
    };
    googleLogin(req: any): "No User from Google" | {
        message: string;
        user: any;
    };
}
