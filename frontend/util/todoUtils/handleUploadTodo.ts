import axios from "axios";
import { nanoid } from "nanoid";
export type TodoType = {
    name:string,
    tasks:string[],
    tags:string[],
    todoId?:string
}
const handleOfflineAdd = async ({name, tags, tasks}:TodoType)=>{
    try {
        
        const _localTodo = await localStorage.getItem('todos');
        const addTodo = {
            id:nanoid(),
            tags,
            pendingTasks:tasks,
            name
        }
        if(!_localTodo) throw Error('Failed Local update');
        const _parsedTodo = await JSON.parse(_localTodo);
        if(!_parsedTodo) throw Error("Failed local update");
        _parsedTodo.push({...addTodo, completedTasks:[]});

        const _filteredStringify = await JSON.stringify(_parsedTodo);

        localStorage.setItem('todos', _filteredStringify);
        

        // create pendingOnline update queue
        let pendingUpdates = localStorage.getItem('pendingNewTodo');
        if(!pendingUpdates){
            let _pendingUpdates = [addTodo];
            let _pendingUpdatesStringify = JSON.stringify(_pendingUpdates);
            localStorage.setItem('pendingNewTodo', _pendingUpdatesStringify);
        }
        else{
            let _parsedPendingNewTodo = JSON.parse(pendingUpdates);
            _parsedPendingNewTodo.push(addTodo);
            let _pendingNewTodoStringify = JSON.stringify(_parsedPendingNewTodo);
            localStorage.setItem('pendingNewTodo', _pendingNewTodoStringify);
        }

    } catch (error) {
        throw error
    }

}
const handleOnlineAdd = async ({name, tags, tasks}:TodoType)=>{
    try { 
        const authReq = axios.create({ headers: { token: `Bearer ${localStorage.getItem('accessToken')}` } });
        await authReq.post(`https://todo-api-toz9.onrender.com/api/todos/create-todo`, {name, tags,tasks});
    } catch (error) {
        throw error;
    }
}
const handleAdd = async ({name, tags, tasks}:TodoType, isOnline:boolean)=>{
    try {
        if(!isOnline)
           await handleOfflineAdd({name, tags, tasks});
        else await handleOnlineAdd({name, tags, tasks})
    } catch (error) {
        console.log(error);
        throw error
    }
    
};

export {handleAdd, handleOnlineAdd, handleOfflineAdd};