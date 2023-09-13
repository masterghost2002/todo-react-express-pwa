export type User = {
    id:string,
    userId:string,
    name:string,
    email:string,
    todos:Todo[],
    createdAt:Date
}
export type Todo = {
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
export type TodoType = {
    name:string,
    pendingTasks:string[],
    completedTasks?:string[],
    tags:string[],
    todoId?:string
}
export type TodoFormType = {
    isUploading:boolean,
    handleSave:(TodoType)=>void,
    todo?:Todo
}