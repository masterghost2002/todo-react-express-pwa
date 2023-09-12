import  { useState, useCallback } from 'react'
import TodoForm from '../component/TodoForm';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import {handleAdd} from '../../util/todoUtils/handleUploadTodo';
import { useIsOnline } from 'react-use-is-online'
export type TodoType = {
    name:string,
    tasks:string[],
    tags:string[],
    todoId?:string
}
export default function CreateTodo() {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { isOnline } = useIsOnline();
  const handleSave = useCallback(async ({ name, tasks, tags }: TodoType) => {
    if (name.trim().length === 0) {
      toast.error('Name is required');
      return;
    }
    if (tasks.length > 0 && tasks[tasks.length - 1].trim().length === 0)
      tasks.pop();
    if (tasks.length === 0) {
      toast.error('Please provide at least one non empty tast');
      return;
    }
    const toastId = toast.loading('Adding new todo');
    try {
      setIsUploading(true);

      await handleAdd({ name, tasks, tags }, isOnline);
      toast.dismiss(toastId);
      toast.success('Todo is added');
      navigate('/todos')
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Todo add failed');
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  }, []);


  return (
    <div
      className='py-2 px-6 md:px-16'
    >
      <h1
        className='text-3xl  md:text-4xl font-bold'
      >
        Create  Todo
      </h1>
      <TodoForm
        handleSave={handleSave}
        isUploading={isUploading}
      />
    </div>
  )
}
