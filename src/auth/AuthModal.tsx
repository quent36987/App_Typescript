import Login from "./Login";
import Signup from "./Signup";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AppState } from "../Context";


export default function AuthModal() {

    const { user, setAlert } = AppState();


    const logOut = () => {
        signOut(auth);
        setAlert({
            open: true,
            type: "success",
            message: "Logout Successfull !",
        });
    };

    const handleClose = () => {
        //
      };

    return (
            
                <div>
                    {!user ?
                        <div>
                            <h1>Pas encore connecté ?</h1>
                            <h2>Signup</h2>
                            <Signup handleClose={handleClose} />
                            <h2>Login</h2>
                            <Login handleClose={handleClose} />
                        </div> :
                        <div>
                            <h1>hello {user.email} </h1>
                            <button onClick={logOut}>Logout</button>
                        </div>
                    } 
                
        </div> 

    )
}

