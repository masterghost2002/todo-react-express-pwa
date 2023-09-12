import Header from "./component/Header"
import { Outlet } from "react-router-dom"
import useUpdateOnline from '../hooks/useUpdateOnline';
import useDeleteOnline from "../hooks/useDeleteOnline";
import useAddTodoOnline from '../hooks/useAddTodoOnline';
export default function RootLayout() {
  useUpdateOnline();
  useDeleteOnline()
  useAddTodoOnline();
  return (
    <div>
      <Header/>
      <Outlet/>
    </div>
  )
}
