import React, { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { toast } from 'react-hot-toast'
import type {Todo} from '../../types';
export type TodoType = {
    name:string,
    tasks:string[],
    tags:string[],
    todoId?:string
}
export type TodoFormType = {
    isUploading:boolean,
    handleSave:(obj:TodoType)=>void,
    todo?:Todo
}
type TaskItemType = {
    id: number,
    value: string;
    handleTasks: (value: string, id: number) => void,
    onDelete: (id: number) => void,
}
const TaskItem = ({ id, value, handleTasks, onDelete }: TaskItemType) => {
    const [input, setInput] = useState(value);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }
    return (
        <div
            className='flex gap-2'
        >
            <input
                type='text'
                placeholder='task'
                className='p-2 rounded-md w-full bg-slate-100'
                value={input}
                onChange={(e) => handleChange(e)}
                onBlur={() => handleTasks(input, id)}
            >
            </input>
            <button
                className=''
                onClick={() => onDelete(id)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>

            </button>
        </div>
    )
}
export default function TodoForm({ isUploading, handleSave, todo = undefined }: TodoFormType) {
    const [tasks, setTasks] = useState<string[]>([]);
    const [todoName, setTodoName] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [singleTag, setSingleTag] = useState('');

    const handleTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTodoName(e.target.value);
    }
    const handleTasks = (value: string, id: number) => {
        const newTasks = tasks.map((task, index) => {
            if (index === id) return value;
            return task;
        });
        if(newTasks.length>0)
            setTasks(newTasks);

    }
    const removeTag = (index:number)=>{
      // @ts-ignore
        const _tags = tags.filter((tag, id)=>id!==index);
        setTags(_tags);
    }
    const handleTag = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const len = value.length;
        const _v = value.trim();
        if (value[len - 1] === ' ' && value.trim().length > 0) {
            setTags((prev) => [...prev, _v]);
            setSingleTag('');
        }
        else setSingleTag(_v);
    }
    const onDelete = (id: number) => {
      // @ts-ignore
        const filteredTask = tasks.filter((task, index) => index != id);
        setTasks(filteredTask);
    }
    const addTask = () => {
        const length = tasks.length;
        if(length && tasks[length-1].trim().length === 0){
            toast.error("Task must not be empty");
            return;
        }
        setTasks((prevTasks) => [
            ...prevTasks,
            ''
        ]);
    }
    useEffect(()=>{
        if(!todo) return;
        setTags(todo.tags);
        setTodoName(todo.name);
        setTasks([...todo.pendingTasks, ...todo.completedTasks]);
    }, [todo])
    return (
        <div
            className='sm:px-6 md:px-[220px] my-8'
        >
            <form
                className='flex flex-col gap-5 w-full p-2 sm:p-4 rounded-md'
            >
                <div
                    className='flex flex-col gap-2 items-center'
                >
                    <label
                        className='text-2xl font-bold text-slate-600 self-start'
                    >
                        Name
                    </label>
                    <input
                        type='text'
                        placeholder='Name of your todo'
                        className='p-2 rounded-md w-full bg-slate-100'
                        value={todoName}
                        onChange={(e) => handleTodoName(e)}
                    >
                    </input>
                </div>
                <div
                    className='flex flex-col gap-5'
                >
                    <div
                        className='text-2xl text-slate-600 font-bold flex gap-2 items-center'
                    >
                        <span>
                            Create Tasks
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                        </svg>


                    </div>
                    {
                        tasks && tasks.map((task, index) => {
                            const keyId = nanoid();
                            return (
                                <TaskItem
                                    key={keyId}
                                    id={index}
                                    value={task}
                                    handleTasks={handleTasks}
                                    onDelete={onDelete}
                                />
                            )
                        })
                    }
                    <div
                        className='flex justify-end'
                    >
                        <button
                            className=''
                            onClick={() => addTask()}
                            type='button'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    className='flex flex-col gap-5'
                >
                    <label
                        className='text-2xl font-bold text-slate-600 self-start'
                    >
                        Add Tags
                    </label>
                    <input
                        type='text'
                        placeholder='add space after tag name'
                        className='p-2 rounded-md w-full bg-slate-100'
                        value={singleTag}
                        onChange={(e) => handleTag(e)}
                    >
                    </input>
                    <div
                        className='flex  flex-wrap gap-2'
                    >
                        {
                            tags && tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className='p-2 relative text-sm bg-blue-500 rounded-lg text-white font-medium'
                                >
                                    {tag}
                                    <button
                                        className='absolute -top-1 -right-1 bg-red-500 rounded-full'
                                        onClick={()=>removeTag(index)}
                                        type='button'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>

                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div
                    className='flex p-2 justify-end items-center rounded-md'
                >
                    <button
                        className='flex gap-2 items-center p-2 bg-blue-500  rounded-md text-white font-medium hover:bg-blue-400'
                        onClick={() => handleSave({ name:todoName, tasks, tags, todoId:todo?.id })}
                        type='button'
                        disabled={isUploading}
                    >
                        Save
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    )
}
