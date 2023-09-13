import { useEffect } from 'react';
import toast from 'react-hot-toast'
import { handleOnlineAdd } from '../util/todoUtils/handleUploadTodo';
import { useIsOnline } from 'react-use-is-online'
import { handleOnlineDelete } from "../util/todoUtils/handleDelete";
import { handleOnlineUpdate } from "../util/todoUtils/handleTodo";
import debounce from '../util/debounce';
export default function useHandleOnline() {
    const { isOnline } = useIsOnline();
    const addTodos = debounce(async () => {
        const _pendingNewTodoStringify = localStorage.getItem('pendingNewTodo');
        if (!_pendingNewTodoStringify) return;
        const _parsedPendingNewTodo = JSON.parse(_pendingNewTodoStringify);
        if (_parsedPendingNewTodo.length === 0) return;
        const toastId = toast.loading('Add new todos from local  to cloud');
        localStorage.removeItem('pendingNewTodo');
        const _pending = _parsedPendingNewTodo;
        try {
            while (_pending.length) {   
                const _todo: any | undefined = _pending[_pending.length-1];
                if (!_todo) return;
                await handleOnlineAdd({ name: _todo.name, tags: _todo.tags, pendingTasks: _todo.pendingTasks, completedTasks:_todo.completedTasks });
                _pending.pop();
            }
            toast.dismiss(toastId);
            toast.success('Data is updated');
        } catch (error) {
            toast.dismiss(toastId);
            toast.error('Adding of new todo failed in between')
            console.log(error);
            const _stringifyTodo = JSON.stringify(_pending);
            localStorage.setItem('pendingNewTodo', _stringifyTodo);
        }
    }, 1000)

    const deleteTodos = debounce(async () => {    
        const _pendingTodoStringify =  localStorage.getItem('pendingDelete');
        if (!_pendingTodoStringify) return;
        const _pendingTodoParse = JSON.parse(_pendingTodoStringify);
        localStorage.removeItem('pendingDelete');
        const toastId = toast.loading('Upating local deleted todos to cloud');
        if (!_pendingTodoParse) return;
        const _pending = _pendingTodoParse;
        try {
            while (_pending.length) {
                const todoId: string | undefined = _pending[_pending.length-1];
                if (!todoId) return;               
                await handleOnlineDelete(todoId);
                _pending.pop();
            }
            toast.dismiss(toastId);
            toast.success('Data is updated on cloud');
        } catch (error) {
            toast.dismiss(toastId);
            toast.error('Deletion on cloud failed in between')
            console.log(error);
            const _stringifyTodo = JSON.stringify(_pending);
            localStorage.setItem('pendingDelete', _stringifyTodo);
        }finally{
            toast.dismiss(toastId)
        }

    }, 1000)

    const updateTodo = debounce(async () => {
        const _pendingTodoStringify = localStorage.getItem('pendingUpdates');
        if (!_pendingTodoStringify) return;
        const _pendingTodoParse = JSON.parse(_pendingTodoStringify);
        if (!_pendingTodoParse) return;
        const toastId = toast.loading('Upating local data to cloud');
        localStorage.removeItem('pendingUpdates');
        const _pending = _pendingTodoParse;
        try {
            while(_pending.length){
                const _todo:any | undefined = _pending[_pending.length-1];
                if(!_todo) return;
                await handleOnlineUpdate({name:_todo.name,todoId:_todo.id, tags:_todo.tags, pendingTasks:_todo.pendingTasks, completedTasks:_todo.completedTasks});
                _pending.pop()
            }
            toast.dismiss(toastId);
            toast.success('Data is updated');
        } catch (error) {
            toast.dismiss(toastId);
            toast.error('Updation failed in between')
            console.log(error);
            const _stringifyTodo = JSON.stringify(_pending);
            localStorage.setItem('pendingUpdates', _stringifyTodo);
        }

    }, 1000);
 
    useEffect(()=>{
        const resolveAll = async ()=>{         
            try {
                const res = await Promise.all([addTodos(), updateTodo(), deleteTodos()]);
            } catch (error) {
                console.log(error);
            }
        }
        let tid:any;
        tid = setTimeout(()=>{
            if(isOnline)
                resolveAll();
        }, 5000)
        return ()=>clearTimeout(tid);
    }, [isOnline]);
}