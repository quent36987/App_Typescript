/*import * as colorsJson  from './bd/days.json'; // This import style requires "esModuleInterop", see "side notes"
console.log(colorsJson.days);
*/


let obj = JSON.parse('{ "myString": "string", "myNumber": 4 }');
console.log(obj.myString);
console.log(obj.myNumber);


//download a json file from github with http request
var xmlhttp = new XMLHttpRequest();
var url = "https://raw.githubusercontent.com/Hackathlon/Hackathlon/main/package-lock.json";
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        console.log(myArr);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();







/*
import a from "./bd/days.json";
console.log(a.days);*/
/*
import fs from 'fs'
var dataArray = JSON.parse(fs.readFileSync('./bd/days.json', 'utf-8'))
*/