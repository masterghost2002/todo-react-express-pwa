import Login from "../component/Login"
import { useNavigate } from "react-router-dom"
import { useIsOnline } from "react-use-is-online"
import { useEffect, useState } from "react"
import axios from "axios"
export default function LoginPage() {
  const {isOnline} = useIsOnline();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(()=>{
    const accessToken = localStorage.getItem('accessToken');
    if(!isOnline && accessToken)
      navigate('/todos');

    // if there is a token and token is valid do a auto login
    const handleAutoLogin = async (token:string)=>{
      const authReq = axios.create({ headers: { google_token: `Bearer ${token}` } });
      try {
        setIsLoading(true);
        await authReq.post('https://todo-api-toz9.onrender.com/api/user/init');
        navigate('/todos');
      } catch (error) {
        console.log(error);
      }finally{
        setIsLoading(false);
      }
    }
    const google_token = localStorage.getItem('/google_token');
    if(google_token)
      handleAutoLogin(google_token);
  }, []);
  if (isLoading) {
    return(
    <div
      className='h-screen flex flex-col gap-5 items-center justify-center'
    >
      Signing Please wait ...
    </div>
    )
  }
  return (
        <Login
          setIsLoading = {setIsLoading}
        />
  )
}
