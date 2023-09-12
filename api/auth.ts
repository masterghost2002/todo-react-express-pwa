import { NextFunction as Next, Request, Response } from 'express';
import jwt_decode from "jwt-decode";
import jwt from 'jsonwebtoken'
export async function google_auth(req: Request, res: Response, next: Next) {
    const authHeader = req.headers.google_token;
    if (authHeader) {
        // @ts-ignore
        const accessToken = authHeader.split(" ")[1];
        try {
            const user = jwt_decode(accessToken);
            req.body.user = user;
            return next();
        } catch (error) {
            console.log(error);
            return res.status(404).json('user not found');
        }
    }
    else
        return res.status(404).json('Unauthorized')
}
export async function auth_token(req: Request, res: Response, next: Next) {
    const authHeader = req.headers.token;
    if (authHeader) {
        // @ts-ignore
        const accessToken = authHeader.split(" ")[1];
        // @ts-ignore
        jwt.verify(accessToken, '7NGoOHGzZBxkmiWr6zlAHpc4N15ySQS8', (err, user) => {
            if (err) return res.status(403).json('unatuhroized');
            else req.body.user = user; 
            return next();
        })
    }
    else
        return res.status(404).json('Unauthorized')
}