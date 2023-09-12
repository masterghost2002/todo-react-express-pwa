import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Login() {
  const navigate = useNavigate();
  const handleSuccess = async (response: any) => {
    localStorage.setItem('google_token', response.tokenId);
    const authReq = axios.create({ headers: { google_token: `Bearer ${response.tokenId}` } });
    try {
      const res = await authReq.post('https://calm-pink-chinchilla-tie.cyclic.app/api/user/init');
      const accessToken = res.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      navigate('/todos')
    } catch (error) {
      console.log(error);
    }

  }
  return (
    <div
    >
      <GoogleLogin
        clientId={import.meta.env.VITE_CLIENT_ID || ""}
        buttonText='Login'
        onSuccess={handleSuccess}
        cookiePolicy='single_host_origin'
        isSignedIn={true}
      >

      </GoogleLogin>
    </div>
  )
}
