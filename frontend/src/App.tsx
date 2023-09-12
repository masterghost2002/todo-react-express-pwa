import { useEffect } from "react"
import { gapi } from "gapi-script"
import { Route, Routes } from "react-router-dom"
import Login from "./component/Login"
import RootLayout from "./RootLayout"
import { Toaster } from "react-hot-toast"
import Todos from './pages/Todos';
import CreateTodo from "./pages/CreateTodo"
import EditTodoPage from "./pages/EditTodo"
export default function App() {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientID: import.meta.env.VITE_CLIENT_ID || "",
        scope: ""
      })
    }
    gapi.load('client:auth2', start)
  }, [])
  return (
    <div
      className="h-screen"
    >
      <div><Toaster /></div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/todos" element={<RootLayout />}>
          <Route index element={<Todos/>}/>
          <Route path="create-todo" element={<CreateTodo/>}/>
          <Route path="edit-todo/:todoId" element={<EditTodoPage/>}/>
        </Route>
      </Routes>
    </div>
  )
}
