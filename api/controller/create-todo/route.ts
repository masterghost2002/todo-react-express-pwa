import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const db = new PrismaClient();
export default async function POST(req: Request, res:Response) {
    const {name, tasks, tags, user} = req.body;    
    try {
        await db.todo.create({
            data:{
                userId:user.id,
                name,
                pendingTasks:tasks,
                tags
            }
        });
        return res.status(200).json('success');

    } catch (error) {
        return res.status(500).json('Server Error');
    }
}