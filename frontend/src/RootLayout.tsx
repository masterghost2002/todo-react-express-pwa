import Header from "./component/Header"
import { Outlet } from "react-router-dom"
// import useUpdateOnline from '../hooks/useUpdateOnline';
// import useDeleteOnline from "../hooks/useDeleteOnline";
// import useAddTodoOnline from '../hooks/useAddTodoOnline';
import useHandleOnline from '../hooks/useHandleOnline';
export default function RootLayout() {

  useHandleOnline();
  return (
    <div>
      <Header/>
      <Outlet/>
    </div>
  )
}
