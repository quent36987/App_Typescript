import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const App = createContext(null);
const Context = ({ children }) => {

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success",
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) setUser(user);
            else setUser(null);
        });
    }, []);


    return (
        <App.Provider
            value={{
                alert,
                setAlert,
                user,
            }}
        >
            {children}
        </App.Provider>
    );
};

export default Context;

export const AppState = () => {
    return useContext(App);
};
