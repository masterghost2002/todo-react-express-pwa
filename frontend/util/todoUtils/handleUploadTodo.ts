import axios from "axios";
import { nanoid } from "nanoid";
export type TodoType = {
    name:string,
    pendingTasks:string[],
    completedTasks?:string[],
    tags:string[],
    todoId?:string
}
const handleOfflineAdd = async ({name, tags, pendingTasks, completedTasks}:TodoType)=>{
    try {
        
        const _localTodo =  localStorage.getItem('todos');
        const addTodo = {
            id:nanoid(),
            tags,
            pendingTasks:pendingTasks,
            completedTasks:completedTasks?completedTasks:[],
            name
        }
        if(!_localTodo) throw Error('Failed Local update');
        const _parsedTodo = await JSON.parse(_localTodo);

        if(!_parsedTodo) throw Error("Failed local update");
        _parsedTodo.push(addTodo);


        // setting up new todos
        const _newTodos =  JSON.stringify(_parsedTodo);
        localStorage.setItem('todos', _newTodos);
        

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
const handleOnlineAdd = async ({name, tags, pendingTasks, completedTasks}:TodoType)=>{
    try { 
        const authReq = axios.create({ headers: { token: `Bearer ${localStorage.getItem('accessToken')}` } });
        await authReq.post(`https://todo-api-toz9.onrender.com/api/todos/create-todo`, {name, tags,pendingTasks, completedTasks});
        // await authReq.post(`http://localhost:5000/api/todos/create-todo`, {name, tags,pendingTasks, completedTasks});

    } catch (error) {
        throw error;
    }
}
const handleAdd = async ({name, tags, pendingTasks, completedTasks}:TodoType, isOnline:boolean)=>{
    try {
        if(!isOnline)
           await handleOfflineAdd({name, tags, pendingTasks});
        else await handleOnlineAdd({name, tags,pendingTasks, completedTasks})
    } catch (error) {
        console.log(error);
        throw error
    }
    
};

export {handleAdd, handleOnlineAdd, handleOfflineAdd};