import { GoogleLogout } from "react-google-login";
import { useNavigate } from "react-router-dom";
export default function Logout(){
    const navigate = useNavigate();
    return(
        <div>
            <GoogleLogout
                clientId={import.meta.env.VITE_CLIENT_ID|| ""}
                buttonText="Logout"
                onLogoutSuccess={()=>navigate('/')}
            />
        </div>
    )
}