import { GoogleLogout } from "react-google-login";
import { useNavigate } from "react-router-dom";
export default function Logout(){
    const navigate = useNavigate();
    const handleLogOut = ()=>{
        localStorage.removeItem('todos');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('pendingUpdates');
        localStorage.removeItem('pendingTodos');
        localStorage.removeItem('pendingDelete');
        localStorage.removeItem('google_token');
        navigate('/')
    }
    return(
        <div
        >
            <GoogleLogout
                clientId={import.meta.env.VITE_CLIENT_ID|| ""}
                buttonText="Logout"
                onLogoutSuccess={handleLogOut}
            />
        </div>
    )
}