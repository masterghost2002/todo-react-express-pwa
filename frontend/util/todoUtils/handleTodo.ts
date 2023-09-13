import {Todo, TodoType} from '../../types'
import axios from "axios";
const handleOfflineUpdate = async ({name, tags, pendingTasks, completedTasks, todoId}:TodoType)=>{
    try {
        
        const _localTodo = localStorage.getItem('todos');
        const updatedTodo = {
            id:todoId,
            tags,
            pendingTasks:pendingTasks,
            completedTasks:completedTasks?completedTasks:[],
            name
        }
        if(!_localTodo) throw Error('Failed Local update');
        const _parsedTodo = await JSON.parse(_localTodo);
        if(!_parsedTodo) throw Error("Failed local update");

        // find index
        const index = _parsedTodo.findIndex((todo:Todo)=>todo.id === todoId);

        _parsedTodo[index] = updatedTodo;
 

        const _filteredStringify =  JSON.stringify(_parsedTodo);

        localStorage.setItem('todos', _filteredStringify);


        // check is todo in pendingTask change if yes remove it from the pendingChangeTask 
        const _pendingTaskChangeTodo = localStorage.getItem('pendingTaskChangeTodo');
        if(_pendingTaskChangeTodo){
            localStorage.removeItem('pendingTaskChangeTodo');
            const _parsedPendingTaskChangeTodo = await JSON.parse(_pendingTaskChangeTodo);
            const _filteredPendingTaskChangeTodo = _parsedPendingTaskChangeTodo.filter((todo:Todo)=>todo.id  !== todoId);
            const _stringifyPendingTaskChangeTodo = JSON.stringify(_filteredPendingTaskChangeTodo);
            localStorage.setItem('pendingChangeTaskTodo', _stringifyPendingTaskChangeTodo);
            
        }
        

        // check if the current todo is in pendingAdd if yes then simply update it in pendingNewTodo and return
        const _pendingNewTodo = localStorage.getItem('pendingNewTodo');
        if(_pendingNewTodo){
            localStorage.removeItem('pendingNewTodo');
            const _parsedPendingNewTodo = await JSON.parse(_pendingNewTodo);
            
            const index = _parsedPendingNewTodo.findIndex((todo:Todo)=>todo.id === todoId);
            if(index !== -1){
                _parsedPendingNewTodo[index] = updatedTodo
                const _stringifyPendingNewTodo = JSON.stringify(_parsedPendingNewTodo);
                localStorage.setItem('pendingNewTodo', _stringifyPendingNewTodo);
                return;
            }
        }

        // create pendingOnline update queue
        let pendingUpdates = localStorage.getItem('pendingUpdates');
        if(!pendingUpdates){
            let _pendingUpdates = [updatedTodo];
            let _pendingUpdatesStringify = JSON.stringify(_pendingUpdates);
            localStorage.setItem('pendingUpdates', _pendingUpdatesStringify);
        }
        else{
            let _parsedPendingUpdates = JSON.parse(pendingUpdates);
            let _filteredPendingUpdates = _parsedPendingUpdates.filter((todo:any)=>todo.id !== updatedTodo.id);
            _filteredPendingUpdates.push(updatedTodo);
            let _pendingUpdatesStringify = JSON.stringify(_filteredPendingUpdates);
            localStorage.setItem('pendingUpdates', _pendingUpdatesStringify);
        }

    } catch (error) {
        throw error
    }

}
const handleOnlineUpdate = async ({name, tags, completedTasks, pendingTasks, todoId}:TodoType)=>{
    try { 
        const authReq = axios.create({ headers: { token: `Bearer ${localStorage.getItem('accessToken')}` } });     
        await authReq.put(`https://todo-api-toz9.onrender.com/api/todos/update-todo/${todoId}`, {name, tags,completedTasks,pendingTasks, todoId});
        // await authReq.put(`http://localhost:5000/api/todos/update-todo/${todoId}`, {name, tags,completedTasks,pendingTasks, todoId});

    } catch (error) {
        console.log(error);
        throw error;
    }
}
const handleUpdate = async ({name, tags, pendingTasks,completedTasks, todoId,}:TodoType, isOnline:boolean)=>{
    try {
        if(!isOnline)
           await handleOfflineUpdate({name, tags, pendingTasks,completedTasks, todoId});
        else await handleOnlineUpdate({name, tags, pendingTasks,completedTasks, todoId})
    } catch (error) {
        console.log(error);
        throw error
    }
    
};

export {handleUpdate, handleOnlineUpdate};