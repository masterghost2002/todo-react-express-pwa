import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const db = new PrismaClient();
export default async function GET(req: Request, res:Response) {
    const {user} = req.body;
    try {
        const userData = await db.user.findUnique({
            where:{
                email:user.email
            },
            include:{
                todos:true
            }
        });                
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(200).json('Error');
    }
}