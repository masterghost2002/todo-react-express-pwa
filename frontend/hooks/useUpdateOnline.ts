"use client"
import { useEffect, useState, useCallback } from "react";
import { handleOnlineUpdate } from "@/util/todoUtils/handleTodo";
import debounce from "@/util/debounce";
import toast from 'react-hot-toast'
import { useIsOnline } from 'react-use-is-online'
export default function useUpdateOnline() {
    
    const {isOnline} = useIsOnline();
    const [pendingTodo, setPendingTodo] = useState([]);
    const updateTodo = debounce(async (_pendingTodoParse) => {
        const toastId = toast.loading('Upating local data to cloud');
        localStorage.removeItem('pendingUpdates');
        const _pending = _pendingTodoParse;
        try {
            while(_pending.length){
                const _todo:any | undefined = _pending[_pending.length-1];
                if(!_todo) return;
                await handleOnlineUpdate({name:_todo.name,todoId:_todo.id, tags:_todo.tags, tasks:_todo.pendingTodo});
                _pending.pop()
            }
            toast.dismiss(toastId);
            toast.success('Data is updated');
        } catch (error) {
            toast.dismiss(toastId);
            toast.error('Updation failed in between')
            console.log(error);
            const _stringifyTodo = JSON.stringify(_pending);
            localStorage.setItem('pendingUpadates', _stringifyTodo);
        }

    },2000);

    useEffect(() => {
        const _pendingTodoStringify = localStorage.getItem('pendingUpdates');
        if (!_pendingTodoStringify) return;
        const _pendingTodoParse = JSON.parse(_pendingTodoStringify);
        if (!_pendingTodoParse) return;
        setPendingTodo(_pendingTodoParse);
        if(navigator.onLine)
            updateTodo(_pendingTodoParse);
    }, [isOnline]);
}