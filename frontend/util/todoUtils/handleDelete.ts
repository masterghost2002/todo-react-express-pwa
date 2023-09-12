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
        console.log('hello');
        return;
    }

    // create pendingOnline update queue
    let pendingUpdates = localStorage.getItem('pendingDelete');
    if (!pendingUpdates) {
        let _pendingUpdates = [todoId];
        let _pendingUpdatesStringify = JSON.stringify(_pendingUpdates);
        localStorage.setItem('pendingDelete', _pendingUpdatesStringify);
    }
    else {
        let _parsedPendingUpdates = JSON.parse(pendingUpdates);
        let _pendingUpdatesStringify = JSON.stringify({ ..._parsedPendingUpdates, todoId });
        localStorage.setItem('pendingDelete', _pendingUpdatesStringify);
    }

}
const handleOnlineDelete = async (todoId: string) => {
    try {
        const authReq = axios.create({ headers: { token: `Bearer ${localStorage.getItem('accessToken')}` } });
        await authReq.delete(`https://calm-pink-chinchilla-tie.cyclic.app/api/todos/delete-todo/${todoId}`);
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