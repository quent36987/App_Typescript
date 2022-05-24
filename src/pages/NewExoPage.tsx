import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { Link } from 'react-router-dom';
import VerticalList from '../componants/formExo';
import { Button, Col, FloatingLabel, Form, InputGroup, Row } from 'react-bootstrap';
import './allPage.css';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import { TextField } from '@material-ui/core';
import './allPage.css';


type Item = {
    id: number;
    name: string;
    time: number;
}
const data = [
    {
        id : 0,
        name : "select the seance mode you want",
        description : "This saves time to create the series of exercises",
    },
    {
        id : 1,
        name : "Tabata",
        description : "A tabata is a cardio session where you do different exercises with the same time",
    },
    {
        id : 2,
        name : "Emom",
        description : "bla bla bla",
    },
    {
        id : 3,
        name : "Serie Exo",
        description : "bla bla bla",
    },
    {
        id : 4,
        name : "Full Custom",
        description : "bla bla bla",
    },
]

const ChronoForm: React.FunctionComponent<IPage> = props => {
    const [type, setType] = React.useState(0);

    const [titre, setTitre] = React.useState("");
    const [cycles, setCycles] = React.useState(0);
    const [recovery, setRecovery] = React.useState(0);

    const [description, setDescription] = React.useState("");

    const [exercices_time, setExercices_time] = React.useState(0);
    const [rest_time, setRest_time] = React.useState(0);
    const [Number_of_exercises, setNumber_of_exercises] = React.useState(0);

    const [items, setItems] = useState<Item[]>([]);

    const [validated, setValidated] = useState(false);
    const [change, setChange] = useState(false);

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props])


    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {

        }

        setValidated(true);
    };

    const addItem = () => {
        console.log("addItem");
        const i = items;
        i.push({
            id: i.length === 0 ? 0 : i.sort((a, b) => a.id - b.id)[i.length - 1].id + 1,
            name: "nouveau",
            time: 0,
        });
        setItems(i);
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

        const handleChange = (e, itemId) => {
            const i = items;
            const index = i.findIndex(item => item.id === itemId);
            i[index].name = e.target.value;
            handleRLDDChange(i);
        };

        return (
            <div >
                <InputGroup className="mb-3 " >
                    <FloatingLabel
                        label="Name of Exercise"
                        style={{ width: "100%" }}
                    >
                        <Form.Control
                            id={"f"+item.id.toString()}
                            onClick={(e) => document.getElementById("f" + item.id.toString()).focus()}
                            onChange={(e) => handleChange(e, item.id)}
                            type="text" placeholder="name@example.com"
                            required

                        />
                    </FloatingLabel>
                    <Button variant="btn btn-outline-danger" id={"button-addon2"+item.id.toString()}
                        style={{
                            "position": "absolute", "right": "0px",
                            "top": "0px", "width": "10%", "height": "100%"
                        }}
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




    return (
        <div className='AuthPage'>
            <h1 className='Titre2' >Create your own tailor-made sports session</h1>
            <div className="NewExoPage-content">
                <div className='NewExoPage-content-form' style={{"maxWidth":"700px"}}>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Select value={type} onChange={(e) => setType(parseInt(e.target.value))}
                                aria-label="Default select example"
                                required >
                                {data.map((item, index) => (
                                    <option key={index} value={item.id}>{item.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Text className="text-muted" >
                              {data[type].description}
                            </Form.Text>
                        </Row>


                        {type === 0 ? <></> : <>
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
                                        type="number"
                                        placeholder="in seconds"
                                        value={recovery !== 0 ? recovery : ""}
                                        onChange={(e) => setRecovery(parseInt(e.target.value))}
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
                            { type !== 4 ? <>
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
                                    <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Number of exercises</Form.Label>
                                    <Form.Control
                                        size='sm'
                                        required
                                        type="number"
                                        placeholder="per cycle"
                                        disabled={type === 3}
                                        value={Number_of_exercises ? Number_of_exercises : ""}
                                        onChange={(e) => setNumber_of_exercises(parseInt(e.target.value))}
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
                            { type === 4 ? 
                            <div>
                                <Button variant="btn btn-outline-secondary" style={{
                                    "width": "80%",
                                    "marginBottom": "10px"
                                }} onClick={addItem}>
                                    Add Rest
                                </Button>
                            </div>
                            : null }  
                            <div>
                                <Button variant="btn btn-outline-secondary" style={{
                                    "width": "80%",
                                    "marginBottom": "30px"
                                }} onClick={addItem}>
                                    Add Exercise
                                </Button>
                            </div>
                            <Button variant="btn btn-outline-success" type="submit">
                                Submit
                            </Button>

                        </>}
                    </Form>
                </div>
            </div>
        </div>
    )








}

export default ChronoForm;