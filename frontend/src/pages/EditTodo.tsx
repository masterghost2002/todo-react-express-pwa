import { useState } from 'react'
import TodoForm from '../component/TodoForm';
import toast from 'react-hot-toast'
import type { TodoType } from '../../types';
import { useNavigate } from 'react-router-dom';
import useHandleFetchTodo from '../../hooks/useHandleFetchTodo';
import { handleUpdate } from '../../util/todoUtils/handleTodo'
import { useIsOnline } from 'react-use-is-online'
import { useParams } from 'react-router-dom';
export default function EditTodoPage() {
    const { todoId } = useParams();
    const { todo } = useHandleFetchTodo({ todoId });

    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const { isOnline } = useIsOnline();

    const handleSave = async ({ name, tasks, tags, todoId }: TodoType) => {

        const toastId = toast.loading('Uploading todo');
        try {
            setIsUploading(true);
            await handleUpdate({ name, tasks, tags, todoId }, isOnline);
            toast.dismiss(toastId);
            toast.success('Todo is updated');
            navigate('/todos');
        } catch (error) {
            toast.dismiss(toastId);
            console.log(error);
            toast.error('Todo update failed')
        }
        finally {
            setIsUploading(false);
        }
    }
    return (
        <div
            className='py-6 px-6 md:px-16'
        >
            <h1
                className='text-3xl  md:text-4xl font-bold'
            >
                Edit  Todo
            </h1>
            <TodoForm
                handleSave={handleSave}
                isUploading={isUploading}
                todo={todo}
            />
        </div>
    )
}
