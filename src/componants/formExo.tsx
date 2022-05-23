import * as React from "react";
import RLDD from "react-list-drag-and-drop/lib/RLDD";
import "./listexo.css";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { TextField } from "@material-ui/core";


interface Item {
  id: number;
  name: string;
  time: number;
}

interface State {
  items: Item[];

  name_exo: string;
  time: number | null;

  name: string;
  cycle: number | null;
  recovery: number | null;
  type: string;
  description: string;
  rest_time: number | null;
  exercises_time: number | null;
}

export default class VerticalList extends React.PureComponent<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      items: [], name: "",
      cycle: 0, recovery: 0, type: "Serie Exo", description: "", rest_time: 0, time: 0, name_exo: "",
      exercises_time: 0
    };

  }



  render() {

    const handleChange = (e) => {
      this.setState({ type: e.target.value })
    }

    const items = this.state.items;
    return (
      <div>
        <select onChange={(e) => handleChange(e)}>
          <option value="Serie Exo">Serie d'Exo (Serie classique)</option>
          <option value="Tabata">Tabata (cardio)</option>
          <option value="Emom">Emom</option>
          <option value="Pyramide">Pyramide</option>
        </select>
        <h1>You chose {this.state.type}</h1>

        <div className="listexo">

          <div>
            <label>
              Name :
              <input type="text" value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })} />
            </label>
          </div>
          <div>
            <label>
              recovery:
              <input type="number" value={this.state.recovery ? this.state.recovery : ""}
                onChange={(e) => this.setState({ recovery: parseInt(e.target.value.replace(/\+|-/ig, '')) })} />
            </label>
          </div>
          <div>
            <label>
              cycle:
              <input type="number" value={this.state.cycle ? this.state.cycle : ""}
                onChange={(e) => this.setState({ cycle: parseInt(e.target.value.replace(/\+|-/ig, '')) })} />
            </label>
          </div>
          <div>
            <label>
              rest_time:
              <input type="number" value={this.state.rest_time ? this.state.rest_time : ""}
                onChange={(e) => this.setState({ rest_time: parseInt(e.target.value.replace(/\+|-/ig, '')) })} />
            </label>
          </div>
          <div>
            <label>
              description:
              <input type="text" value={this.state.description}
                onChange={(e) => this.setState({ description: e.target.value })} />
            </label>
          </div>

          {this.state.type === "Tabata" ?
            <div>
              <label>
                time exercise:
                <input type="text" value={this.state.exercises_time ? this.state.exercises_time : ""}
                  onChange={(e) => this.setState({ exercises_time: parseInt(e.target.value.replace(/\+|-/ig, '')) })} />
              </label>
            </div> : null}
        </div>



        <div className="example vertical">
          <h2>Liste des Exos</h2>
          <div>
            <label>
              Name exo:
              <input type="text" value={this.state.name_exo}
                onChange={(e) => this.setState({ name_exo: e.target.value })} />
            </label>
          </div>

          {this.state.type === "Tabata" ? null :
            <div>
              <label>
                time:
                <input type="number" value={this.state.time ? this.state.time : ""}
                  onChange={(e) => this.setState({ time: parseInt(e.target.value.replace(/\+|-/ig, '')) })} />
              </label>
            </div>
          }

          <div>
          </div>


          <button onClick={this.addItem} >
            add
          </button>


          <RLDD
            cssClasses="list-container"
            items={items}
            itemRenderer={this.itemRenderer}
            onChange={this.handleRLDDChange}
          />
        </div>
        <button onClick={this.submit} >
          Submit
        </button>
      </div>
    );
  }


  addPost = async () => {
    const collectionRef = collection(db, "exercices");
    const payload2 = {
      name: this.state.name,
      date: (Date.now()),
      cycles: this.state.cycle,
      recovery_time: this.state.recovery,
      type: this.state.type,
      description: this.state.description,
      rest_time: this.state.rest_time,
      exercises: this.state.items.map(item => item.name),
      exercises_info: this.state.items.map(item => item.time),
      exercises_time: this.state.time,
    };
    try {
      await addDoc(collectionRef, payload2);
      console.log("addDoc success");
    }
    catch (error) {
      console.log(error);
    }
  };

  private addItem = () => {
    const items = this.state.items;
    items.push({
      id: items.length === 0 ? 0 : items.sort((a, b) => a.id - b.id)[items.length - 1].id + 1,
      name: this.state.name_exo,
      time: this.state.time ? this.state.time : 0,
    });

    //reset input
    this.setState({ name_exo: "" });
    this.setState({ time: null });
    this.handleRLDDChange(items);
    this.forceUpdate();
  };


  private submit = () => {
    this.addPost();
  };

  private removeItem = (id: number) => {
    const items = this.state.items;
    const index = items.findIndex(item => item.id === id);
    items.splice(index, 1);
    this.handleRLDDChange(items);
    this.forceUpdate();
  };

  private itemRenderer = (item: Item, index: number): JSX.Element => {

    const handleChange = (e, itemId) => {
      const items = this.state.items;
      const index = items.findIndex(item => item.id === itemId);
      items[index].name = e.target.value;
      this.handleRLDDChange(items);
      this.forceUpdate();
    };

    return (
      <div className="item">

        <div className="details">
          <TextField id={item.id.toString()} type="text" value={item.name}
            onClick={(e) => document.getElementById(item.id.toString()).focus()}
            onChange={(e) => handleChange(e, item.id)} />

          <p className="body">{this.state.type === 'Tabata' ? this.state.exercises_time : item.time}</p>

        </div>
        <div className="small">
          item.id: {item.id} - index: {index}
        </div>
        <button onClick={() => this.removeItem(item.id)}>
          remove
        </button>
      </div>
    );
  };

  private handleRLDDChange = (reorderedItems: Array<Item>) => {
    this.setState({ items: reorderedItems });

  };
}
