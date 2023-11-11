import { VerifyCallback } from 'passport-42';
declare const OAuth_base: new (...args: any[]) => any;
export declare class OAuth extends OAuth_base {
    constructor();
    validate(accesToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
export {};
