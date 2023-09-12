require('dotenv').config();
import express, {Request, Response} from 'express';
const app = express();
import cors from 'cors';
app.use(cors());
import getTodo from './controller/get-todos/route';
import deleteTodo from './controller/delete-todo/route';
import postTodo from './controller/create-todo/route';
import putTask from './controller/update-todo/update-task/route';
import putTodo from './controller/update-todo/route';
import postInitalProfile from './controller/init-profile/route';
const PORT = process.env.PORT || 5000;
import {google_auth, auth_token} from './auth';
app.use(express.json());
app.use('/api/user', google_auth);
app.use('/api/todos', auth_token);
app.get('/', (req:Request, res:Response)=>{
    return res.status(200).json('Hello')
});
app.post('/api/user/init', postInitalProfile);
app.post('/api/todos/create-todo', postTodo);
app.put('/api/todos/update-todo/:todoId/:taskIndex', putTask);
app.put('/api/todos/update-todo/:todoId', putTodo);
app.delete('/api/todos/delete-todo/:todoId', deleteTodo);
app.get('/api/todos', getTodo);
app.listen(PORT, ()=>console.log('Listening to port: ', PORT))

