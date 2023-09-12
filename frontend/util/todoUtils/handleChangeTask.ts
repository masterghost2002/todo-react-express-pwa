import { Todo } from "../../types";
import axios from "axios";
import toast from 'react-hot-toast'
const handleChangeTaskOffline = (todoId: string, taskIndex:number) => {

    const _localTodo = localStorage.getItem('todos');
    if (!_localTodo) throw Error('Failed Local update');
    localStorage.removeItem('todos');
    
    const _localTodoParsed  = JSON.parse(_localTodo);
    if(_localTodoParsed.length === 0) return;
    const _index = _localTodoParsed.findIndex((todo:Todo)=>todo.id === todoId);
    const task = _localTodoParsed[_index].pendingTasks[taskIndex];
    _localTodoParsed[_index].completedTasks.push(task);
    _localTodoParsed[_index].pendingTasks.filter((task:string, index:number)=>index !== taskIndex);

    const _pendingTodoTask = _localTodoParsed[_index];

    const _localStringify = JSON.stringify(_localTodoParsed);
    localStorage.setItem('todos', _localStringify);





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
            toast.error("Feature in process");
        }
        else await handleChangeTaskOnline(todoId, taskIndex)
    } catch (error) {
        console.log(error);
        throw error
    }

};

export { handleChangeTask, handleChangeTaskOnline };