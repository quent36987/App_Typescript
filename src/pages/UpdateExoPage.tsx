import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { Button, Col, FloatingLabel, Form, FormControl, InputGroup, Row, ToggleButton } from 'react-bootstrap';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import './allPage.css';
import { arrayUnion,  doc,  getDoc,  updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AppState } from '../Context';
import { Item } from '../data/ItemType';
import { Exo, ExoConverter } from '../data/ExoClass';
import { User, UserConverter } from '../data/UserClass';
import { RouteComponentProps } from 'react-router-dom';


const UpdateExoPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const { user, setAlert } = AppState();
    const [titre, setTitre] = React.useState("");
    const [cycles, setCycles] = React.useState(0);
    const [recovery, setRecovery] = React.useState(0);
    const [description, setDescription] = React.useState("");
    const [rest_time, setRest_time] = React.useState(0);
    const [items, setItems] = useState<Item[]>([]);
    const [isPublic, setIsPublic] = useState(false);
    const [validated, setValidated] = useState(false);
    const [change, setChange] = useState(false);
    const [exo, setExo] = useState<Exo>(null);

    const [exos, setExos] = useState<Exo[]>([]);

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props])


    useEffect(() => {
        console.log(exo);
        if (exo) {
            setTitre(exo.titre);
            setCycles(exo.cycles);
            setRecovery(exo.recovery_time);
            setDescription(exo.description);
            setRest_time(exo.rest_time);
           
            const list: Item[] = [];
            exo.exercises.forEach((e,i)=> {
                list.push({
                    id : i,
                    name : e.name,
                    time : e.time,
                    type : e.type,
                    time_inf : e.time_inf,

                    time_bis : 0,
                    cycles : 0,
                })
            });

            handleRLDDChange(list);
            setChange(!change);

           
           
        }
    }, [exo])


    useEffect(() => {
        async function getdata() {
            if (props.match.params.exoId) {
                console.log("id" + props.match.params.exoId);
                const ref = doc(db, "exercises", props.match.params.exoId).withConverter(ExoConverter);
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    var data = docSnap.data();
                    data.id = docSnap.id;
                    setExo(data);
                    setIsPublic(true);
                } else {
                    if (user) {
                        const docRef = doc(db, "Users", user.uid).withConverter<User>(UserConverter);
                        try {
                            const docc = await getDoc(docRef);
                            setExos(docc.data().exo);
                            setIsPublic(false);
                            var val = null;
                            if (docc.exists() && (val = docc.data().exo.find(e => e.id === props.match.params.exoId))) {
                                setExo(new Exo(val.cycles, val.date, val.description, val.exercises,
                                    val.recovery_time, val.rest_time, val.time_total,
                                    val.titre, val.type, val.useruid, props.match.params.exoId));
                            }
                        } catch (e) {
                            console.log("Error getting cached document:", e);
                            setAlert({
                                open: true,
                                message: "Error getting cached document",
                                type: "error",
                            });

                        }
                        setAlert({
                            open: false,
                            message: "exercises doesnt exist ?!",
                            type: "success",
                        });
                    }
                    else {
                        setAlert({
                            open: true,
                            message: "exercises doesnt exist ?!",
                            type: "error",
                        });
                    }
                }
            }
        };
        getdata();
    }, [props, user, setAlert]);


    const handleSubmit = (event) => {
        console.log("re" + recovery);
        console.log(items);
       
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true && items.length > 0) {
            sendToFirebase();
        }
        setValidated(true);
    };

    const addItem = (type: number) => {
        const i = items;
        var n = [...items];
        n.push({
            id: items.length === 0 ? 0 : i.sort((a, b) => a.id - b.id)[items.length - 1].id + 1,
            name: type == 0 ? null : "rest",
            time: 0,
            type: type,
            time_inf: false,

            time_bis: 0,
            cycles: 0,
        });
        handleRLDDChange(n);
        setChange(!change);
    };

    const removeItem = (id: number) => {
        const i = items;
        const index = i.findIndex(item => item.id === id);
        i.splice(index, 1);
        handleRLDDChange(i);
        setChange(!change);
    };

    function ItemRenderer  (item: Item, index: number) {

        const handleChangeName = (e, itemId) => {
            const i = items;
            const index = i.findIndex(item => item.id === itemId);
            i[index].name = e.target.value;
            handleRLDDChange(i);
        };
        const handleChangeTime = (e, itemId) => {
            const i = items;
            const index = i.findIndex(item => item.id === itemId);
            i[index].time = e.target.value ? parseInt(e.target.value) : 0;
            handleRLDDChange(i);
        };
        const handleChangeTimebis = (e, itemId) => {
            const i = items;
            const index = i.findIndex(item => item.id === itemId);
            i[index].time_bis = e.target.value ? parseInt(e.target.value) : 0;
            handleRLDDChange(i);
        };
        const handleChangeTimeing = (e, itemId) => {
            const i = items;
            const index = i.findIndex(item => item.id === itemId);
            i[index].time_inf = !i[index].time_inf
            handleRLDDChange(i);
            setChange(!change);
        };
        const handleChangeCycle = (e, itemId) => {
            const i = items;
            const index = i.findIndex(item => item.id === itemId);
            i[index].cycles = parseInt(e.target.value);
            handleRLDDChange(i);
            setChange(!change);
        };

        return (
            <div >
                <InputGroup className="mb-3 " >
                    {item.type === 2 ?
                        <>
                            <FormControl
                                className='itemexo'
                                placeholder="Cycles"
                                type="text"
                                id={"cy" + item.id.toString()}
                                onClick={(e) => document.getElementById("cy" + item.id.toString()).focus()}
                                onChange={(e) => handleChangeCycle(e, item.id)}
                                style={{ "width": "5%" }}
                                required
                            />
                            <FormControl
                                className='itemexo'
                                placeholder="Name of Exercise"
                                type="text"
                              
                                id={"na" + item.id.toString()}
                                onClick={(e) => document.getElementById("na" + item.id.toString()).focus()}
                                onChange={(e) => handleChangeName(e, item.id)}
                                style={{ "width": "40%" }}
                                required
                            />
                            <FormControl aria-label="Last name" type='number' placeholder="Time in s"
                                id={"id2" + item.id.toString()}
                                onClick={(e) => document.getElementById("id2" + item.id.toString()).focus()}
                                onChange={(e) => handleChangeTime(e, item.id)}
                                required={!item.time_inf}
                                disabled={item.time_inf}
                            />
                            <ToggleButton
                                id={"binrf" + item.id.toString()}
                                type="checkbox"
                                variant="outline-secondary"
                                checked={item.time_inf}
                                value="1"
                                onChange={(e) => {
                                    handleChangeTimeing(e, item.id);
                                }}
                            >
                                ♾️
                            </ToggleButton>
                            <FormControl
                                className='itemrest'
                                placeholder="Rest Time"
                                disabled
                                type="text"
                                style={{ "width": "60%" }}
                            />
                            <FormControl aria-label="Last name" type='number' placeholder="Time in s"
                                id={"id3" + item.id.toString()}
                                required
                                onClick={(e) => document.getElementById("id3" + item.id.toString()).focus()}
                                onChange={(e) => handleChangeTimebis(e, item.id)}
                            />

                        </>
                        :
                        <>   {
                            item.type === 0 ?
                                <FormControl
                                    className="Name of Exercise"
                                    placeholder={item.name ? item.name : "Name of Exercise"}
                                    type="text"
                                    value={item.name}
                                    id={"f" + item.id.toString()}
                                    onClick={(e) => document.getElementById("f" + item.id.toString()).focus()}
                                    onChange={(e) => {   setChange(!change); ;handleChangeName(e, item.id) }}
                                    style={{ "width": "50%" }}
                                    required
                                />
                                :
                                <FormControl
                                    className='itemrest'
                                    placeholder="Rest Time"
                                    disabled
                                    type="text"
                                    id={"f" + item.id.toString()}
                                    onClick={(e) => document.getElementById("f" + item.id.toString()).focus()}
                                    onChange={(e) => handleChangeName(e, item.id)}
                                    style={{ "width": "50%" }}
                                />
                        }
                           
                                <FormControl aria-label="Last name" type='number' placeholder="Time in s"
                                    id={"id2" + item.id.toString()}
                                    value={item.time}
                                    onClick={(e) => document.getElementById("id2" + item.id.toString()).focus()}
                                    onChange={(e) =>{ setChange(!change); handleChangeTime(e, item.id)}}
                                    required={!item.time_inf}
                                    disabled={item.time_inf} />
                                <ToggleButton
                                    id={"binrf" + item.id.toString()}
                                    type="checkbox"
                                    variant="outline-secondary"
                                    checked={item.time_inf}
                                    value="1"
                                    onChange={(e) => {
                                        handleChangeTimeing(e, item.id);
                                    }}
                                >
                                    ♾️
                                </ToggleButton>
                            
                        </>}
                    <Button variant="btn btn-outline-danger" id={"button-addon2" + item.id.toString()}
                        onClick={() => removeItem(item.id)}  >
                        🗑️
                    </Button>

                </InputGroup>
            </div>
        );
    };

    const handleRLDDChange = (reorderedItems: Array<Item>) => {
        setItems(reorderedItems);
    };



    const sendToFirebase = async () => {
        // calculate the exercises 
        var exercises: Item[] = [];
        var lengthItem = items.length;
        var time_total = 0;
        let index_exo = 0;
        
             // Full Custom
            var items_transforming = [];
            items.forEach(item => {
                if (item.cycles > 0) {
                    items_transforming.push({
                        id: item.id,
                        name: item.name,
                        time: item.time_inf ? 15 : item.time,
                        time_inf: item.time_inf,
                        type: 0,
                    });
                    for (let i = 1; i < item.cycles; i++) {
                        items_transforming.push({
                            id: item.id,
                            name: "rest",
                            time: item.time_bis,
                            time_inf: false,
                            type: 1,
                        });
                        items_transforming.push({
                            id: item.id,
                            name: item.name,
                            time: item.time_inf ? 15 : item.time,
                            time_inf: item.time_inf,
                            type: 0,
                        });
                    }
                } else {
                    items_transforming.push({ 
                        id: item.id,
                        name: item.name,
                        time: item.time_inf ? 15 : item.time,
                        time_inf: item.time_inf,
                        type: item.type,
                    });
                }
            }); 
            items_transforming.forEach(item => {
                item.time = item.time_inf ? 15 : item.time;
            });
            exercises = items_transforming;
            time_total += items_transforming.reduce((acc, cur) => acc + cur.time, 0);
               

           
        time_total *= cycles;
        time_total += (cycles - 1) * recovery;
        //send the message
        const payload = {
            id : exo.id,
            titre: titre,
            date: exo.date,
            cycles: cycles,
            recovery_time: recovery,
            type: exo.type,
            description: description,
            rest_time: rest_time,
            exercises: exercises,
            useruid: user.uid,
            time_total: time_total,
        };
      
        console.log(payload); 
        try {
            if (isPublic) {
                console.log("0" + props.match.params.exoId);
                const collectionRef = doc(db, "exercises", props.match.params.exoId);
                await updateDoc(collectionRef, payload);
            }
            else {
                console.log(exo.id);
                const UserDocRef = doc(db, 'Users', user.uid);
                await updateDoc(UserDocRef, { exercises : exos.filter(e => e.id !== exo.id) });
                await updateDoc(UserDocRef, { exercises : arrayUnion(payload) });

            }
            console.log("addDoc success");
            setAlert({
                open: true,
                type: "success",
                message: "Add !"
            });
        }
        catch (error) {
            console.log(error);
            setAlert({
                open: true,
                type: "error",
                message: "Network error or user error"
            });
        }
    }


    return (
        <div className='AuthPage'>
            {user ? <>
                <h1 className='Titre2' >Update your session</h1>
                <div className="NewExoPage-content">
                    <div className='NewExoPage-content-form' style={{ "maxWidth": "700px" }}>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            
                            
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="titreid">
                                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Titre</Form.Label>
                                        <Form.Control
                                            size='sm'
                                            required
                                            type="text"
                                            placeholder="session title"
                                            value={titre}
                                            onChange={(e) => setTitre(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="cycleid">
                                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Cycles</Form.Label>
                                        <Form.Control
                                            size='sm'
                                            required
                                            type="number"
                                            placeholder="number of cycles"
                                            value={cycles !== 0 ? cycles : ""}
                                            onChange={(e) => setCycles(parseInt(e.target.value))}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="recoverid">
                                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Recovery Time</Form.Label>
                                        <Form.Control
                                            size='sm'
                                            required
                                            disabled={cycles === 1}
                                            type="time"
                                            placeholder="min:sec"
                                            value={ ((recovery-recovery%60)/60).toString().padStart(2,"0") + ":"+ (recovery%60).toString().padStart(2, "0")}
                                            onChange={(e) => {
                                                var tab = e.target.value.split(":").map(Number)
                                                setRecovery(tab[0] * 60 + tab[1])
                                            }}
                                        />
                                    </Form.Group>
                                </Row>

                                <FloatingLabel controlId="commentid" label="Comments" className="mb-3">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Leave a comment here"
                                        style={{ height: '90px' }}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </FloatingLabel>
                               
                                <h1 className='Titre3' >List of exercises : {items.length}</h1>
                                <div >
                                <RLDD
                                        cssClasses=""
                                        items={items}
                                        itemRenderer={ItemRenderer}
                                        onChange={handleRLDDChange}
                                    />

                                
                                </div>
                               
                                    <div>
                                        <Button variant="btn btn-outline-secondary" style={{
                                            "width": "80%",
                                            "marginBottom": "10px"
                                        }} onClick={() => addItem(1)}>
                                            Add Rest
                                        </Button>
                                    </div>
                                    <div>
                                        <Button variant="btn btn-outline-secondary" style={{
                                            "width": "80%",
                                            "marginBottom": "10px"
                                        }} onClick={() => addItem(2)}>
                                            Add Cycle
                                        </Button>
                                    </div>
                                
                                <div>
                                    <Button variant="btn btn-outline-secondary" style={{
                                        "width": "80%",
                                        "marginBottom": "30px"
                                    }} onClick={() => addItem(0)}>
                                        Add Exercise
                                    </Button>
                                </div>
                                <Button variant="btn btn-outline-success" type="submit">
                                    Update
                                </Button>
                            
                        </Form>
                    </div>
                </div>
            </> : <>
                <h1 className='Titre2' >Log in to create personalized sessions!</h1>
                <Button onClick={() => window.location.href = "/auth/login"}>Log in !</Button>
            </>}
        </div>
    )








}

export default UpdateExoPage;