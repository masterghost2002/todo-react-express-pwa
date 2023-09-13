import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Login({setIsLoading}:{setIsLoading:React.Dispatch<React.SetStateAction<boolean>>}) {
  const navigate = useNavigate();


  const handleSuccess = async (response: any) => {

    localStorage.setItem('google_token', response.tokenId);
    const authReq = axios.create({ headers: { google_token: `Bearer ${response.tokenId}` } });
    try {
      const res = await authReq.post('https://todo-api-toz9.onrender.com/api/user/init');
      // const res = await authReq.post('http://localhost:5000/api/user/init');

      const accessToken = res.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      navigate('/todos');
    } catch (error) {
      console.log(error);
    }

  }
 
  return (
    <div
      className='h-screen flex flex-col gap-5 items-center justify-center'
    >
      <div
        className='text-[60px] font-medium flex gap-2 items-center'
      >
        Todo
        <img
          src='./Logo.png'
          className='h-[60px]'
        >
        </img>
      </div>
      <div
        className='text-xl font-medium'
      >
        Continue Using Google
      </div>
      <div
      >
        <GoogleLogin
          clientId={import.meta.env.VITE_CLIENT_ID || ""}
          buttonText='Login'
          onSuccess={handleSuccess}
          cookiePolicy='single_host_origin'
          isSignedIn={true}
          className='w-[120px]'
          onFailure={() => setIsLoading(false)}
          onRequest={() => setIsLoading(true)}
        >
        </GoogleLogin>
      </div>

    </div>
  )
}
