import { Todo } from "../../types";
import axios from "axios";
const handleOfflineDelete = (todoId: string) => {

    const _localTodo = localStorage.getItem('todos');
    if (!_localTodo) throw Error('Failed Local update');
    localStorage.removeItem('todos');
    const _parsedTodo = JSON.parse(_localTodo);
    if (!_parsedTodo) throw Error("Failed local update");



    const _filteredTodo = _parsedTodo.filter((todo: Todo) => todo.id !== todoId)

    const filterTodoStringify = JSON.stringify(_filteredTodo);
    if (filterTodoStringify.length !== 0)
        localStorage.setItem('todos', filterTodoStringify);


    // check if the current todo is in pendingAdd if yes then simply remove it from pending addand return

    const _pendingNewTodo = localStorage.getItem('pendingNewTodo');
    let _parsedPendingNewTodo = [];
    if (_pendingNewTodo) {
        localStorage.removeItem('pendingNewTodo');
        _parsedPendingNewTodo = JSON.parse(_pendingNewTodo);
    }
    const _filteredPendingNewTodo = _parsedPendingNewTodo.filter((todo: Todo) => todo.id === todoId);
    
    if (_filteredPendingNewTodo.length >0) {
        const _stringifyPendingNewTodo = JSON.stringify(_filteredPendingNewTodo);
        if (_filteredPendingNewTodo.length > 0) {
            localStorage.setItem('pendingNewTodo', _stringifyPendingNewTodo);
        }
        return;
    }

    // check is in pending update
    const _pendingUpdates = localStorage.getItem('pendingUpdates');
    if(_pendingUpdates){
        const _parsedPendingUpdates = JSON.parse(_pendingUpdates);
        const _filteredPendingUpdates = _parsedPendingUpdates.filter((todo:Todo)=>todo.id !== todoId);
        const stringifyPendingUpdates = JSON.stringify(_filteredPendingUpdates);
        localStorage.setItem('pendingUpdates', stringifyPendingUpdates);
    }

    // create pendingOnline update queue
    let pendingDeletes = localStorage.getItem('pendingDelete');
    if (!pendingDeletes) {
        let _pendingDeletes = [todoId];
        let _pendingDeletesStringify = JSON.stringify(_pendingDeletes);
        localStorage.setItem('pendingDelete', _pendingDeletesStringify);
    }
    else {
        let _parsedPendingDeletes = JSON.parse(pendingDeletes);
        let _pendingDeletsStringify = JSON.stringify({ ..._parsedPendingDeletes, todoId });
        localStorage.setItem('pendingDelete', _pendingDeletsStringify);
    }

}
const handleOnlineDelete = async (todoId: string) => {
    try {
        const authReq = axios.create({ headers: { token: `Bearer ${localStorage.getItem('accessToken')}` } });
        await authReq.delete(`https://todo-api-toz9.onrender.com/api/todos/delete-todo/${todoId}`);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
const handleDelete = async (todoId: string, isOnline:boolean) => {
    try {
        if (!isOnline)
            handleOfflineDelete(todoId);
        else await handleOnlineDelete(todoId)
    } catch (error) {
        console.log(error);
        throw error
    }

};

export { handleDelete, handleOnlineDelete };