import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { AppState } from '../Context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';


class User {
    public name: string;
    public exo: {date : Date, exo : string}[];
    constructor(name, exo) {
        this.name = name;
        this.exo = exo;
    }
    toString() {
        return this.name;
    }
}

const UserConverter = {
    toFirestore: (user) => {
        return {
            name: user.name,
            exo: user.exo,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.name, data.exo_log);
    }
};


const ProfilePage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const { user, setAlert } = AppState();
    const [userdata, setUserdata] = useState(null);

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
        if (user) {
            setAlert({
                open: true,
                message: "you must be logged in to access this page",
                type: "error",
            });
        }
    }, [props] )


    useEffect(() => {
        async function getdata() {
            if (user) {
                const ref = doc(db, "Users", user.uid).withConverter(UserConverter);
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    setUserdata(docSnap.data());
                } else {
                    setAlert({
                    open: true,
                    message: "error to get user data",
                    type: "error",});
                }
            }
        };
        getdata();
    }, [user]);

    return (
        <div>
            <Link to="/">Go to the home page!</Link>
            {userdata  ? 
            <div>
                <h1>nom : {userdata.name}</h1>

                {userdata.exo ? <>
                <h1>nombre exo fini : { userdata.exo.length}</h1>
                <h6>exo fini : {userdata.exo.map(exo => exo.exo  + "\n" )}</h6>
               </> : null
                }

                <h1>rajouter stats blabla</h1>
            </div>
            : <div>loading</div>}
        </div>
    );
}

export default withRouter(ProfilePage);