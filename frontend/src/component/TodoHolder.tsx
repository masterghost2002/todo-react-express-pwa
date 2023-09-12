import React, { useState, useCallback } from 'react'
import TodoCard from './TodoCard';
import useFetchData from '../../hooks/useFetchData';
import { nanoid } from 'nanoid';
import {handleDelete} from '../../util/todoUtils/handleDelete';
import toast from 'react-hot-toast'
import debounce from '../../util/debounce';
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
export default function TodoHolder() {
  const {todos, isLoading, fetch } = useFetchData();
  const [filteredTodos, setFileteredTodos] = useState<Todo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showCommand, setShowCommand] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const {isOnline} = useIsOnline();

  const goodSearch = useCallback(debounce((searchParam) => {
    if (searchParam.length <= 1) return;    
    const query = searchParam[0];
    let result: Todo[] = [];
    let searchResultInfo = ''
    switch (query) {
      case '#':
        searchParam = searchParam.replace('#', '').trim().toLowerCase();   
        result = todos.filter((todo) => {
          const tags = todo.tags;
          
          for (let tag of tags) {
            if (tag.toLowerCase().trim().match(searchParam)) return true;
          }
          return false;
        });
        searchResultInfo = `Found ${result.length} todos with tag  ${searchParam}`;
        break;
      default:
        result = todos.filter((todo) => todo.name.toLowerCase().match(searchParam));
        searchResultInfo = `Found ${result.length} todos with ${searchParam} name`
        break;
    }
    setSearchResult(searchResultInfo);
    setFileteredTodos(result);
  }, 1000), [todos]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchParam = e.target.value;
    setSearchText(searchParam);
    goodSearch(searchParam);
    setSearchResult('');
    if (searchParam.length <= 1) setFileteredTodos([]);
  }

  const handleTagClick = useCallback((tag: string) => {
    setSearchText(tag);
    goodSearch(tag);
    setSearchResult('');
  }, [searchText]);

  const handleOnDelete = useCallback(async (todoId: string) => {
    const toastId = toast.loading('Deleting Todo');
    try {
      await handleDelete(todoId, isOnline);
      toast.dismiss(toastId);
      toast.success("Todo deleted");
      fetch();
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error("Deletion failed");
    }
  }, []);


  if (isLoading) {
    return (
      <div
        className='flex items-center  h-[70vh] justify-center '
      >
        <svg className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
  return (
    <div
      className='p-0 flex flex-col gap-2'
    >
      <div
        className='text-3xl font-bold text-slate-600 self-start'

      >
        Your Todos
      </div>

      <div
        className='flex w-full flex-center flex-col relative mb-10'
      >
        <input
          type="text"
          className='p-2 rounded-md w-full bg-slate-100'
          placeholder='Search Todos by name or tags'
          onFocus={() => setShowCommand(true)}
          onBlur={() => setShowCommand(false)}
          onChange={(e) => handleSearchChange(e)}
          value={searchText}

        />
        {showCommand && <div
          className="flex justify-between items-center absolute shadow glassmorphism top-10 w-full bg-white  rounded mt-2 font-normal font-stoshi text-sm text-gray-700">
          <div
            className='p-2 rounded-md'
          >
            {searchResult.length > 0
              ? <span>{searchResult}</span>
              :
              <span className='p-2'>use # to search using tag</span>
            }
          </div>
        </div>
        }
      </div>
      {
        filteredTodos.length > 0 &&
        <div
          className='text-xl font-bold text-slate-600 self-start'
        >
          Search Result
        </div>
      }
      {todos && filteredTodos.length > 0 ?
        filteredTodos.map((todo, index) => {
          const keyId = nanoid();
          return (
            <TodoCard
              key={keyId}
              todo={todo}
              handleOnDelete={handleOnDelete}
              handleTagClick={handleTagClick}
              fetch={fetch}
            />
          )
        }
        )
        :
        todos.map((todo, index) => {
          const keyId = nanoid();
          return (
            <TodoCard
              key={keyId}
              todo={todo}
              handleOnDelete={handleOnDelete}
              handleTagClick={handleTagClick}
              fetch={fetch}
            />
          )
        }
        )
      }
    </div>
  )
}
