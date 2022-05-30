import { addDoc, arrayUnion, collection, doc, onSnapshot, query, Timestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import logging from "../config/logging";
import { Exo, ExoConverter } from "../data/ExoClass";
import { ImageClass, ImageConverter } from "../data/ImageClass";
import { db } from "../firebase";
import IPage from "../interfaces/page";
import { StringSymplify } from "../Utils/utils";
import './allPage.css';


type ItemExo =
{
    name: string;
    idurl: string;
    url: string;
}

const DashBoardAdminPage: React.FunctionComponent<IPage> = props => {
    const [list_exo, setListExo] = useState<Exo[]>([]);
    const [List_image, setListImage] = useState<ImageClass[]>([]);
 
    const[itemexo, setItemExo] = useState<ItemExo[]>([]);
    const[change, setChange] = useState(false);


    
    

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
        const collectionRef = collection(db, "exercises").withConverter<Exo>(ExoConverter);
        const queryRef = query(collectionRef);
        onSnapshot(queryRef, (snapshot) => {
            const list: Exo[] = [];
            snapshot.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            });
            setListExo(list);
        });
    }, [props])

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
        const collectionRef = collection(db, "images").withConverter<ImageClass>(ImageConverter);
        const queryRef = query(collectionRef);
        onSnapshot(queryRef, (snapshot) => {
            const list: ImageClass[] = [];
            snapshot.forEach((doc) => {
                const img = doc.data();
                img.id = doc.id;
                list.push(img);
            });
            setListImage(list);
        });
    }, [props])


    

    function findUrl(name: string) {
       
        return List_image.find(x => x.name?.includes(StringSymplify(name)));
    }

    function handleChange(exoname,value) {
        var list = itemexo;
        list.forEach(x => {
            if (x.name === exoname) {
                x.url = value;
            }
        });
        setItemExo(list);
        setChange(!change);
    }

    useEffect(() => {
        console.log(List_image);
        //get all exo name on list exo_list
        const list_exo_name: ItemExo[] = [];
        list_exo.forEach((exo) => {
            exo.exercises.forEach((exo_name) => {
                if (!list_exo_name.find((item) => item.name === exo_name.name)) {
                    list_exo_name.push(
                        {
                            name: exo_name.name,
                            idurl: findUrl(exo_name.name)?.id,
                            url: findUrl(exo_name.name)?.url
                        }
                    );
                }
            })
        })
        setItemExo(list_exo_name);

    }, [list_exo,List_image])


    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props.name])


    function addimage(url : string, _name : string){

        var img = List_image.find(x => x.url === url)
        if (img ) {
            const UserDocRef = doc(db, 'images', img.id);
            const payload = { name: arrayUnion(StringSymplify(_name)) };
            updateDoc(UserDocRef, payload);
            console.log("add !");
        }
        else{
            console.log(url);
            const collectionRef = collection(db, "images");
            addDoc(collectionRef, { url: url, name: [StringSymplify(_name)] });
            console.log("add !");
        }
    }
    
    function changeselect(name : string, url : string)
    {
        console.log(name,url);
        handleChange(name,url);
    }

    return (
        <div className='DashBoardPage'>
            <h1 className='Titre2' >DashBoard Admin:</h1>
            {itemexo.map((exo) => {
                return ( 
                    <div style={{"display":"flex","height":"4vh","borderBottom": "1px solid rgb(129, 127, 127)","marginBottom":"1vh"}}>
                        <div className="itemdashboard" style={{"width":"20vw","textAlign":"center"}}>
                            <span className="titreitemdashboard">{exo.name}</span>
                        </div>
                        <div className="itemdashboard" style={{"width":"30vw"}}>
                            <input type='url' style={{"width":"100%"}} className="titreitemdashboard" value={exo.url}
                            onChange={(e) => handleChange(exo.name,e.target.value) }/>
                        </div>
                        <div className="itemdashboard" style={{"width":"10vw"}}>
                            <img  src={exo.url} style={{"width":"auto","height":"4vh"}} />
                        </div>
                        <div className="itemdashboard" style={{"width":"10vw"}}>
                            <button onClick={() => addimage(exo.url,exo.name)}>Add</button>
                        </div>
                         <div className="itemdashboard" style={{"width":"10vw"}}>
                            <select disabled={exo.url !== undefined} onChange={(e) => changeselect(exo.name,e.target.value)} >
                                {itemexo.map((exoo) => {
                                    return (
                                        <option  value={exoo.url}>{exoo.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    )
            })
            }  
        </div>
    )
}

export default DashBoardAdminPage;
