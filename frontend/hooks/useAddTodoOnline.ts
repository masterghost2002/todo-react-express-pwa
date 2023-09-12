"use client"
import { useEffect, useState, useCallback } from "react";
import debounce from "@/util/debounce";
import toast from 'react-hot-toast'
import { handleOnlineAdd } from "@/util/todoUtils/handleUploadTodo";
import { useIsOnline } from 'react-use-is-online'
export default function useAddTodoOnline() {
    const {isOnline} = useIsOnline();
    const [newTodos, setTodos] = useState([]);

    // 
    const addTodos = useCallback(debounce(async (_parsedPendingNewTodo) => {
        const toastId = toast.loading('Add new todos from local  to cloud');
        localStorage.removeItem('pendingNewTodo');
        const _pending = _parsedPendingNewTodo;
        try {
            while (_pending.length) {
                const _todo: any | undefined = _pending[_pending.length-1];
                if (!_todo) return;
                await handleOnlineAdd({ name: _todo.name, tags: _todo.tags, tasks: _todo.pendingTasks });
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

    }, 2000), [newTodos]);


    useEffect(() => {
        const _pendingNewTodoStringify = localStorage.getItem('pendingNewTodo');
        if (!_pendingNewTodoStringify) return;
        const _pendingNewTodoParse = JSON.parse(_pendingNewTodoStringify);
        if (!_pendingNewTodoParse) return;
        setTodos(_pendingNewTodoParse);
        if (isOnline)
            addTodos(_pendingNewTodoParse);

    }, [isOnline]);
}