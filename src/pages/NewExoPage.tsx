import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { Button, Col, FloatingLabel, Form, FormControl, InputGroup, Row, ToggleButton } from 'react-bootstrap';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import './allPage.css';
import { addDoc, arrayUnion, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AppState } from '../Context';
import { Item } from '../data/ItemType';
import { data } from '../data/type_exo_data';
import { v4 } from "uuid";


const ChronoForm: React.FunctionComponent<IPage> = props => {

    const { user, setAlert, perm } = AppState();

    const [type, setType] = React.useState(0);

    const [titre, setTitre] = React.useState("");
    const [cycles, setCycles] = React.useState(0);
    const [recovery, setRecovery] = React.useState(0);

    const [description, setDescription] = React.useState("");

    const [exercices_time, setExercices_time] = React.useState(0);
    const [rest_time, setRest_time] = React.useState(0);
    const [time_cycle, setTime_cycle] = React.useState(0);

    const [items, setItems] = useState<Item[]>([]);

    const [isPublic, setIsPublic] = useState(false);

    const [validated, setValidated] = useState(false);
    const [change, setChange] = useState(false);

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props])


    const handleSubmit = (event) => {
        console.log("re" + recovery);
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
            name: "rest",
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

    const itemRenderer = (item: Item, index: number): JSX.Element => {

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
                                ??????
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
                                    className='itemexo'
                                    placeholder="Name of Exercise"
                                    type="text"
                                    id={"f" + item.id.toString()}
                                    onClick={(e) => document.getElementById("f" + item.id.toString()).focus()}
                                    onChange={(e) => handleChangeName(e, item.id)}
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
                            {type === 4 || type === 3 ? <>
                                <FormControl aria-label="Last name" type='number' placeholder="Time in s"
                                    id={"id2" + item.id.toString()}
                                    onClick={(e) => document.getElementById("id2" + item.id.toString()).focus()}
                                    onChange={(e) => handleChangeTime(e, item.id)}
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
                                    ??????
                                </ToggleButton>
                            </> : null}
                        </>}
                    <Button variant="btn btn-outline-danger" id={"button-addon2" + item.id.toString()}
                        onClick={() => removeItem(item.id)}  >
                        ???????
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
        switch (type) {
            case 1:  // Tabata = > exo + rest... (time of cycle tabata)
                while (index_exo * (rest_time + exercices_time) < time_cycle) {
                    var exo = items[index_exo % lengthItem];
                    exo.time = exercices_time;
                    exercises.push(exo);
                    if ((index_exo + 1) * (rest_time + exercices_time) < time_cycle) {
                        exercises.push({ id: 0, name: "rest", type: 1, time: rest_time, time_inf: false })
                    }
                    index_exo++;
                }
                break;
            case 2: //Pyramide all cycle we change the 
                break;
            case 3: // Serie Exo (add rest time beteewn exo)
                for (let exo = 0; exo < lengthItem; exo++) {
                    exercises.push({ id: items[exo].id, name: items[exo].name, type: 1, time:items[exo].time , time_inf: items[exo].time_inf });
                    if (exo < lengthItem - 1) {
                        exercises.push({ id: 0, name: "rest", type: 1, time: rest_time, time_inf: false })
                    }
                }
                break;
            case 4:  // Full Custom
                const items_transforming = [];
                items.forEach(item => {
                    if (item.cycles > 0) {
                        items_transforming.push({
                            id: item.id,
                            name: item.name,
                            time:  item.time,
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
                                time:  item.time,
                                time_inf: item.time_inf,
                                type: 0,
                            });
                        }
                    } else {
                        items_transforming.push(item);
                    }
                });
                exercises = items_transforming;
              
                break;
            default:
                break;

        }
        exercises.forEach(item => {
            item.time = item.time_inf ? 15 : item.time;
        });  
        time_total += exercises.reduce((acc, cur) => acc + cur.time, 0);
        time_total *= cycles;
        time_total += (cycles - 1) * recovery;
        //send the message
        const payload = {
            id : v4(),
            titre: titre,
            date: Timestamp.now(),
            cycles: cycles,
            recovery_time: recovery,
            type: type,
            description: description,
            rest_time: rest_time,
            exercises: exercises,
            useruid: user.uid,
            time_total: time_total,
        };
        try {
            if (isPublic) {
                const collectionRef = collection(db, "exercises");
                await addDoc(collectionRef, payload);
            }
            else {
                const UserDocRef = doc(db, 'Users', user.uid);
                await updateDoc(UserDocRef, { exercises: arrayUnion(payload) });
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
                <h1 className='Titre2' >Create your own tailor-made sports session</h1>
                <div className="NewExoPage-content">
                    <div className='NewExoPage-content-form' style={{ "maxWidth": "700px" }}>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Row className="mb-3" style={{"marginRight":"1vw","marginLeft":"1vw"}}>
                                <Form.Select  value={type} onChange={(e) => setType(parseInt(e.target.value))}
                                    aria-label="Default select example"
                                    required
                                >
                                    {data.map((item, index) => (
                                        <option key={index} value={item.id}>{item.name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-muted" >
                                    {data[type].description}
                                </Form.Text>
                            </Row>
                            {type === 0 || type === 2 ? <></> : <>
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
                                {type !== 4 ? <>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="exotimeid">
                                            <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Exercise time</Form.Label>
                                            <Form.Control
                                                size='sm'
                                                required
                                                type="number"
                                                placeholder="in seconds"
                                                disabled={type === 3}
                                                value={exercices_time ? exercices_time : ""}
                                                onChange={(e) => setExercices_time(parseInt(e.target.value))}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="resttimeid">
                                            <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Rest Time</Form.Label>
                                            <Form.Control
                                                size='sm'
                                                required
                                                type="number"
                                                placeholder="in seconds"
                                                value={rest_time ? rest_time : ""}
                                                onChange={(e) => setRest_time(parseInt(e.target.value))}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="nbpercycle">
                                            <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Time of 1 Cycle</Form.Label>
                                            <Form.Control
                                                size='sm'
                                                required
                                                placeholder="min:sec"
                                                disabled={type === 3}
                                                type="time"
                                                onChange={(e) => {
                                                    var tab = e.target.value.split(":").map(Number)
                                                    setTime_cycle(tab[0] * 60 + tab[1])
                                                }}
                                            />
                                        </Form.Group>
                                    </Row>
                                </> : null}
                                <h1 className='Titre3' >List of exercises : {items.length}</h1>
                                <div >
                                    <RLDD
                                        cssClasses=""
                                        items={items}
                                        itemRenderer={itemRenderer}
                                        onChange={handleRLDDChange}
                                    />
                                </div>
                                {type === 4 ? <>
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
                                </> : null}
                                <div>
                                    <Button variant="btn btn-outline-secondary" style={{
                                        "width": "80%",
                                        "marginBottom": "30px"
                                    }} onClick={() => addItem(0)}>
                                        Add Exercise
                                    </Button>
                                </div>
                                {perm ?
                                    <Row className="mb-3" style={{ "textAlign": "left", "marginLeft": "20px" }} >
                                        <Form.Check
                                            type="switch"
                                            id="custom-switchpublic"
                                            label="Session Public"
                                            onChange={(e) => setIsPublic(e.target.checked)}
                                        />
                                    </Row>
                                    : null}
                                <Button variant="btn btn-outline-success" type="submit">
                                    Submit
                                </Button>
                            </>}
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

export default ChronoForm;