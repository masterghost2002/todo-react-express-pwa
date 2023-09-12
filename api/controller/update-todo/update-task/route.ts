import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const db = new PrismaClient();
export default async function PUT(req: Request, res:Response) {
    const {todoId, taskIndex} = req.params;
    const _taskIndex = Number(taskIndex);
    try {
        const _todo = await db.todo.findUnique({
            where: {
                id: todoId
            },
            select: {
                pendingTasks: true,
            }
        });

        const task = _todo?.pendingTasks[_taskIndex];
        const data = await db.todo.update({
            where: {
                id: todoId,
            },
            data: {
                pendingTasks: {
                    set: _todo?.pendingTasks?.filter((task, index) => index !== _taskIndex)
                },
                completedTasks: {
                    push: task,
                }
            }
        });      
        return res.status(200).json("Success");
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Error');

    }

}