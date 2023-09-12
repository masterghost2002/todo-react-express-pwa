import {auth} from '@clerk/nextjs';
import { db } from '@/util/db';
export const currentUser = async ()=>{
    const {userId} = auth();
    if(!userId) return null;
    try {
        const profile = await db.user.findUnique({
            where:{
                userId
            }
        });
        return profile;
    } catch (error) {
        console.log(error);
        return null;
    }
}