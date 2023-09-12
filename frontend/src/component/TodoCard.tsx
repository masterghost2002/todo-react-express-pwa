import React, { useState } from 'react'
import axios from 'axios'
import { nanoid } from 'nanoid'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'
import {handleChangeTask} from '../../util/todoUtils/handleChangeTask';
import { useIsOnline } from 'react-use-is-online';
type TodoCardProps = {
  todo: Todo,
  handleOnDelete: (todoId: string) => void,
  handleTagClick: (tag: string) => void,
  fetch: () => void
}
type User = {
  id: string,
  userId: string,
  name: string,
  email: string,
  todos: Todo[],
  createdAt: Date
}
type Todo = {
  id: string,
  userId: string
  user: User
  name: string
  pendingTasks: string[]
  completedTasks: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
export default React.memo(function TodoCard({ todo, handleOnDelete, handleTagClick, fetch }: TodoCardProps) {
  const [pendingTasks, setPendingTasks] = useState<string[]>(todo.pendingTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>(todo.completedTasks);
  const [isUpdating, setIsUpdating] = useState(false);
  const {isOnline} = useIsOnline();
  const handleCompleteClick = async (index: number) => {
    if (isUpdating) {
      toast('Please wait prev update is pending', {
        icon: '⌛',
      });
      return;
    }
    const toastId = toast.loading('Changing task state...');
    try {
      setIsUpdating(true);
      await handleChangeTask(todo.id, index, isOnline);
      const task = pendingTasks[index];
      // @ts-ignore
      const _pendingTasks = pendingTasks.filter((task, id) => id !== index);
      setPendingTasks(_pendingTasks);
      setCompletedTasks(
        [
          task,
          ...completedTasks,
        ]
      );
      toast.dismiss(toastId);
      toast.success('Task completed');
      fetch();
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error('Error while updating task state');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div
      className='border-2 rounded-md my-5 p-2 text-slate-600 flex flex-col gap-5'
    >
      <div
        className='text-2xl font-medium text- flex justify-between items-center'
      >
        <span>
          {todo.name}
        </span>
        <div
          className='flex gap-2 items-center'
        >
          <Link
            to={`/todos/edit-todo/${todo.id}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </Link>
          <button
            onClick={() => handleOnDelete(todo.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>

          </button>
        </div>
      </div>
      <hr></hr>
      <div
        className='flex flex-col gap-2'
      >
        <span
          className='text-xl font-medium'
        >
          Tasks
        </span>
        {pendingTasks.length > 0 && <div
          className='ml-4'
        >
          <span
            className='font-medium text-yellow-500'
          >
            Pending
          </span>
          <div
            className='flex flex-col gap-2'
          >
            {
              pendingTasks.map((task, index) => {
                const keyId = nanoid();

                return (
                  <div
                    className='flex gap-2 justify-between items-center'
                    key={keyId}
                  >
                    <p
                      className='border-2 rounded-md px-1 w-full break-all'
                    >
                      {task}
                    </p>
                    <button
                      onClick={() => handleCompleteClick(index)}
                      type='button'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>

                    </button>
                  </div>
                )
              })
            }
          </div>
        </div>}
        {completedTasks.length > 0 && <div
          className='ml-4'
        >
          <span
            className='font-medium text-green-500 '
          >
            Completed
          </span>
          <div
            className='flex flex-col gap-2'
          >
            {
              completedTasks.map((task) => {
                const keyId = nanoid();
                return (

                  <div
                    key={keyId}
                    className='flex gap-2 justify-between items-center'
                  >
                    <p
                      className='rounded-md px-1 w-full break-all line-through'
                    >
                      {task}
                    </p>
                  </div>
                )
              })
            }
          </div>
        </div>}
      </div>
      <hr></hr>
      <div
        className='flex flex-wrap w-full p-2 gap-5'
      >
        {
          todo.tags && todo.tags.map((tag) => {
            const keyId = nanoid();
            return (
              <div
                onClick={() => handleTagClick(`#${tag}`)}
                className='flex items-center rounded-full bg-blue-500 p-2 text-white cursor-pointer select-none'
                key={keyId}
              >
                #{tag}
              </div>
            )
          })
        }
      </div>
    </div>
  )
})
