import { Todo } from "../types";
import { useState, useEffect } from "react"
export default function useHandleFetchTodo({todoId}:{todoId:string | undefined}) {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [todo, setTodo] = useState<Todo>();
    useEffect(()=>{
        const _todoString  = localStorage.getItem('todos');
        
        if(!_todoString){
            setIsError(true);
            setIsLoading(false);
            return;
        }
        const _todoParsed = JSON.parse(_todoString);
        const requiredTodo = _todoParsed.filter((todo:Todo)=>todo.id === todoId);
        setTodo(requiredTodo[0]);
    }, []);
  return {isLoading, isError, todo};
}
