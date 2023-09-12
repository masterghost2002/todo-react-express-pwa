
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios';
import { useIsOnline } from 'react-use-is-online'
type User = {
  id:string,
  userId:string,
  name:string,
  email:string,
  todos:Todo[],
  createdAt:Date
}
type Todo = {
  id:string,
  userId:string
  user:User
  name:string
  pendingTasks:string[]
  completedTasks:string []
  tags:string[]
  createdAt:Date
  updatedAt:Date
}
type resfetchReturnType = {
  user: User | null,
  todos: Todo[],
  isLoading: boolean,
  isError: boolean,
  fetch: () => Promise<void>
}
export default function useFetchData(): resfetchReturnType {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { isOnline } = useIsOnline();
  const fetch = useCallback(async () => {
    const _todo = localStorage.getItem('todos');
    if (_todo) {
      setTodos([]);
      const _parsedTodo = JSON.parse(_todo);
      if (_parsedTodo && _parsedTodo.length > 0)
        setTodos(_parsedTodo);
      setIsLoading(false);
    }
    if(!isOnline) return;
    try {    
      const authReq = axios.create({ headers: { token: `Bearer ${localStorage.getItem('accessToken')}`}});      
      const res = await authReq.get('https://calm-pink-chinchilla-tie.cyclic.app/api/todos/');
      const data = res.data;
      const { todos, ...user }: { todos: Todo[], user: User } = data;
      if (todos)
        setTodos(todos);
      if (user)
        setUser(user.user);

      const _todosString = JSON.stringify(todos);
      const _userString = JSON.stringify(user);

      localStorage.setItem('todos', _todosString);
      localStorage.setItem('user', _userString);

    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetch();
  }, []);
  return { user, todos, isLoading, isError, fetch };
}
