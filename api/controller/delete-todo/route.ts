import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const db = new PrismaClient();
export default async function DELETE(req:Request, res:Response) {
    const todoId = req.params.todoId;
    try {
        await db.todo.delete({
            where: {
                id: todoId,
            }
        });            
        return res.status(200).json('Success');
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Error');

    }

}