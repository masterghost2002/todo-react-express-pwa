import { Todo } from "../../types";
import axios from "axios";
const handleChangeTaskOffline = async (todoId: string, taskIndex:number) => {

    const _localTodo = localStorage.getItem('todos');
    if (!_localTodo) throw Error('Failed Local update');
    localStorage.removeItem('todos');
    
    const _localTodoParsed  = await JSON.parse(_localTodo);
    if(_localTodoParsed.length === 0) return;
    const _index = _localTodoParsed.findIndex((todo:Todo)=>todo.id === todoId);


    const task = _localTodoParsed[_index].pendingTasks[taskIndex];
    _localTodoParsed[_index].completedTasks.push(task);
     _localTodoParsed[_index].pendingTasks = _localTodoParsed[_index].pendingTasks.filter((task:string, index:number)=>index !== taskIndex);

    const _pendingTaskUpdateTodo = _localTodoParsed[_index];

    
    
    const _localStringify = JSON.stringify(_localTodoParsed);
    localStorage.setItem('todos', _localStringify);
    
    // check is in create new
    const _pendingNewTodo = localStorage.getItem('pendingNewTodo');
    if(_pendingNewTodo){
        const _parsedPendingNewTodo = await JSON.parse(_pendingNewTodo);
        const index = _parsedPendingNewTodo.findIndex((todo:Todo)=>todo.id === todoId);
        if(index>=0){
            _parsedPendingNewTodo[index]  =_pendingTaskUpdateTodo;
            const _stringifyParsedPendingNewTodo = JSON.stringify(_parsedPendingNewTodo);
            localStorage.setItem('pendingNewTodo', _stringifyParsedPendingNewTodo);
            return;
        }
        
    }


    // check is in update todo
    const _pendingUpdate = localStorage.getItem('pendingUpdates');
    if(_pendingUpdate){
        const _parsedPendingUpdates = await JSON.parse(_pendingUpdate);
        const index = _parsedPendingUpdates.findIndex((todo:Todo)=>todo.id === todoId);
        if(index>=0){
            _parsedPendingUpdates[index] = _pendingTaskUpdateTodo;
            const _stringifyParsedPendingUpdate = JSON.stringify(_parsedPendingUpdates);
            localStorage.setItem('pendingUpdates', _stringifyParsedPendingUpdate);
            return;
        }
        else{
            _parsedPendingUpdates.push(_pendingTaskUpdateTodo);
            const _stringifyParsedPendingUpdate = JSON.stringify(_parsedPendingUpdates);
            localStorage.setItem('pendingUpdates', _stringifyParsedPendingUpdate);
            return;
        }
    }
    else{
        const _pendingUpdate = [_pendingTaskUpdateTodo];
        const _stringifyParsedPendingUpdate = JSON.stringify(_pendingUpdate);
        localStorage.setItem('pendingUpdates', _stringifyParsedPendingUpdate);
        return
    }


}
const handleChangeTaskOnline = async (todoId: string, taskIndex:number) => {
    try {
        const authReq = axios.create({ headers: { token: `Bearer ${localStorage.getItem('accessToken')}` } });
        await authReq.put(`https://todo-api-toz9.onrender.com/api/todos/update-todo/${todoId}/${taskIndex}`);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
const handleChangeTask = async (todoId: string,taskIndex:number, isOnline:boolean) => {
    try {
        if (!isOnline){
            handleChangeTaskOffline(todoId, taskIndex);
        }
        else await handleChangeTaskOnline(todoId, taskIndex)
    } catch (error) {
        console.log(error);
        throw error
    }

};

export { handleChangeTask, handleChangeTaskOnline };