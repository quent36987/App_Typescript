import * as React from "react";
import RLDD from "react-list-drag-and-drop/lib/RLDD";
import "./listexo.css";
import fs from 'fs'

const fruits = require("./fruits.json");

const path = require('path');


interface Item {
  id: number;
  title: string;
  body: number;
  icon: string;
}

interface State {
  items: Item[];
  titre: string;
  temps : number | null;
  cycle : number;
  recovery : number;
}

export default class VerticalExample extends React.PureComponent<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { items: [], titre: "" ,
          temps :null,cycle:0,recovery:0};
   
  }

  


  render() {
    // console.log('VerticalExample.render');
    const items = this.state.items;
    return (
      <div className="example vertical">
        <h2>Liste des Exos</h2>
        <div>
        <label>
            Name :
          <input type="text" value={this.state.titre} 
           onChange={(e) => this.setState({ titre: e.target.value })} />
        </label>
        </div>
        <div>
        <label>
            Temps:
          <input type="number" value={this.state.temps ? this.state.temps : ""} 
           onChange={(e) => this.setState({ temps: parseInt(e.target.value.replace(/\+|-/ig, ''))  })} />
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

  private addItem = () => {
    const items = this.state.items;
    items.push({
      id: items.length === 0 ? 0 : items.sort((a, b) => a.id - b.id)[items.length - 1].id + 1,
      title: this.state.titre,
      body: this.state.temps ? this.state.temps : 0,
      icon: ""
    });
    //reset input
    this.setState({ titre: "" });
    this.setState({ temps: null });
    this.handleRLDDChange(items);
    this.forceUpdate();
  };


  private submit = () =>
  {
    console.log(JSON.stringify(this.state.items));

    //save items on a file.json
    //var fs = require('fs');
    var fs = require('browserify-fs');
    var file = path.join('', 'exo.json');

    /*fs.writeFile(file, JSON.stringify(this.state.items), (err) => {
      if (err) throw err;
      console.log('The file has been saved!' +file);
    }
    );*/

  };

  private itemRenderer = (item: Item, index: number): JSX.Element => {
    return (
      <div className="item">
        <div className="icon">{item.icon}</div>
        <div className="details">
          <p className="title">{item.title}</p>
          <p className="body">{item.body}</p>
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
