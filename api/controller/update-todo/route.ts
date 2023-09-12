import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const db = new PrismaClient();
export default async function PUT(req: Request, res:Response) {
    
    const {todoId} = req.params;  
    const {name, tasks, tags} = await req.body;
    try {
        const data = await db.todo.update({
            where: {
                id: todoId,
            },
            data: {
                name,
                pendingTasks:tasks,
                completedTasks:[],
                tags
            }
        });      
        return res.status(200).json('Success');
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Error');

    }

}