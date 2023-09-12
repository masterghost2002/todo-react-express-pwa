import Header from "./component/Header"
import { Outlet } from "react-router-dom"
export default function RootLayout() {
  return (
    <div>
      <Header/>
      <Outlet/>
    </div>
  )
}
