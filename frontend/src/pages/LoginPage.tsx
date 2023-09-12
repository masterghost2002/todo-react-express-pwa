import Login from "../component/Login"
import { useNavigate } from "react-router-dom"
import { useIsOnline } from "react-use-is-online"
import { useEffect } from "react"
export default function LoginPage() {
  const {isOnline} = useIsOnline();
  const navigate = useNavigate();
  useEffect(()=>{
    const accessToken = localStorage.getItem('accessToken');
    if(!isOnline && accessToken)
      navigate('/todos');
  }, [])
  return (
        <Login/>
  )
}
