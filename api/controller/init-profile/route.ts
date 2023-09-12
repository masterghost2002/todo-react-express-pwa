import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
const db = new PrismaClient();
export default async function POST(req: Request, res: Response) {
    const user = await req.body.user;
    try {
        if (!user) return res.status(404).json('user not found');
        const profile = await db.user.findUnique({
            where: {
                email: user.email
            }
        });


        if (profile) {
            const accessToken = await jwt.sign({ ...user, id: profile.id }, '7NGoOHGzZBxkmiWr6zlAHpc4N15ySQS8');
            return res.status(200).json({ accessToken });
        }
        const newProfile = await db.user.create({
            data: {
                name: `${user.given_name} ${user.family_name}`,
                email: user.email
            }
        });
        const accessToken = await jwt.sign({ ...user, id: newProfile.id }, '7NGoOHGzZBxkmiWr6zlAHpc4N15ySQS8');
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Error');
    }
}