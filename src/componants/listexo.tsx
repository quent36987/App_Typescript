import * as React from "react";
import RLDD from "react-list-drag-and-drop/lib/RLDD";
import "./listexo.css";
import {db} from "../firebase";
import { collection, addDoc  } from "firebase/firestore";


interface Item {
  id: number;
  name: string;
  time: number;
  icon: string;
}

interface State {
  items: Item[];

  time : number | null;
  name: string;
  name_exo : string;
  cycle : number | null;
  recovery : number| null;
  type : string;
  description : string;
  rest_time : number| null;

}

export default class VerticalExample extends React.PureComponent<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { items: [], name: "" ,
         cycle:0,recovery:0 ,type:"",description:"",rest_time:0,time:0,name_exo:""};
   
  }

  
  render() {
    // console.log('VerticalExample.render');
    const items = this.state.items;
    return (
      <div className="example vertical">
        <h2>Liste des Exos</h2>
        <div>
        <label>
            Name exo:
          <input type="text" value={this.state.name_exo} 
           onChange={(e) => this.setState({ name_exo: e.target.value })} />
        </label>
        </div>
        <div>
        <label>
            time:
          <input type="number" value={this.state.time ? this.state.time : ""} 
           onChange={(e) => this.setState({ time: parseInt(e.target.value.replace(/\+|-/ig, ''))  })} />
        </label>
        </div>
        <div>
                  </div>
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
           onChange={(e) => this.setState({ recovery: parseInt(e.target.value.replace(/\+|-/ig, ''))  })} />
        </label>
        </div>
        <div>
        <label>
            cycle:
          <input type="number" value={this.state.cycle ? this.state.cycle : ""}
            onChange={(e) => this.setState({ cycle: parseInt(e.target.value.replace(/\+|-/ig, ''))  })} />
        </label>
        </div>
        <div>
        <label>
            rest_time:
          <input type="number" value={this.state.rest_time ? this.state.rest_time : ""}
           onChange={(e) => this.setState({ cycle: parseInt(e.target.value.replace(/\+|-/ig, ''))  })} />
          </label>
        </div>
        <div>
        <label>
          description:
          <input type="text" value={this.state.description} 
          onChange={(e) => this.setState({ description: e.target.value })} />
          </label>
        </div>
      
        <button onClick={this.addItem} >
          add
        </button>
        <button onClick={this.submit} >
          Submit
        </button>

        <RLDD
          cssClasses="list-container"
          items={items}
          itemRenderer={this.itemRenderer}
          onChange={this.handleRLDDChange}
        />
      </div>
    );
  }


  addPost = async () => {
    const collectionRef = collection(db, "post");
    const payload2 = { name : this.state.name ,
                       date:(Date.now()), 
                       cycle:this.state.cycle,
                       recovery:this.state.recovery,
                       type: "Serie Exo",
                       description:this.state.description,
                       rest_time:this.state.rest_time,
                       exercices: this.state.items.map(item => item.name),
                       exercices_time: this.state.items.map(item => item.time)
                      };
    try {
      await addDoc(collectionRef, payload2);
      console.log("addDoc success");
    }
    catch (error)
    {
      console.log(error);
    }
};

  private addItem = () => {
    const items = this.state.items;
    items.push({
      id: items.length === 0 ? 0 : items.sort((a, b) => a.id - b.id)[items.length - 1].id + 1,
      name: this.state.name_exo,
      time: this.state.time ? this.state.time : 0,
      icon: ""
    });
   
    //reset input
    this.setState({ name_exo: "" });
    this.setState({ time: null });
    this.handleRLDDChange(items);
    this.forceUpdate();
  };


  private submit = () =>
  {
    this.addPost();
  };

  private itemRenderer = (item: Item, index: number): JSX.Element => {
    return (
      <div className="item">
        <div className="icon">{item.icon}</div>
        <div className="details">
          <p className="title">{item.name}</p>
          <p className="body">{item.time}</p>
        </div>
        <div className="small">
          item.id: {item.id} - index: {index}
        </div>
      </div>
    );
  };

  private handleRLDDChange = (reorderedItems: Array<Item>) => {
    // console.log('Example.handleRLDDChange');
    this.setState({ items: reorderedItems });
    
  };
}
