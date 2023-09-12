"use client"
import { useEffect, useState, useCallback } from "react";
import toast from 'react-hot-toast'
import { handleOnlineDelete } from "@/util/todoUtils/handleDelete";
import debounce from "@/util/debounce";
import { useIsOnline } from 'react-use-is-online'

export default function useDeleteOnline() {
    const {isOnline} = useIsOnline();
    const [pendingTodo, setPendingTodo] = useState([]);
    // delete
    const deleteTodos = useCallback(debounce(async (_pendingTodoParse:string[]) => {    
        const toastId = toast.loading('Upating local deleted todos to cloud');
        localStorage.removeItem('pendingDelete');
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
        }

    }, 2000), []);


    useEffect(() => {
        const _pendingTodoStringify =  localStorage.getItem('pendingDelete');
        if (!_pendingTodoStringify) return;
        const _pendingTodoParse = JSON.parse(_pendingTodoStringify);
        if (!_pendingTodoParse) return;
        setPendingTodo(_pendingTodoParse);
        if (isOnline)
            deleteTodos(_pendingTodoParse);
    }, [isOnline]);
}