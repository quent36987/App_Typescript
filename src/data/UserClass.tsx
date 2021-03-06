import { Timestamp } from "firebase/firestore";
import { Exo } from "./ExoClass";


export type exo_log ={
    date : Timestamp,
    id : string,
    time : number
}

export class User {
    public firstName: string;
    public lastName: string;
    public genre: string;
    public date_inscription: Timestamp;
    public last_exo_date: Timestamp;
    public temps_tt: number;
    public exo_log : exo_log[] = [];
    public exo: Exo[] = [];

    constructor(firstName, lastName, exo_log, date_inscription, exo: Exo[], genre) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.exo_log = exo_log;
        this.date_inscription = date_inscription;
        this.temps_tt = 0;
        this.genre = genre;
        if (exo) {
        exo.forEach(e => {
            this.exo.push(new Exo(e.cycles,e.date,e.description,e.exercises,e.recovery_time,e.rest_time,e.time_total,e.titre
                ,e.type,e.useruid,e.id));
        }); 
        }
        else
        {
            this.exo = [];
        }
        this.last_exo_date = null;
        //search the early date of the list exo
        if (this.exo_log){
        this.exo_log.forEach(e => {
            if (e.date < this.last_exo_date || this.last_exo_date == null) {
                this.last_exo_date = e.date;
            }
            this.temps_tt += e.time;
        });
        }
        else
        {
            this.exo_log = [];
        }
        //calculate the total time
        
        this.exo = exo;
        this.genre = genre;
    }
}

export const UserConverter = {
    toFirestore: (user) => {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            genre: user.genre,
            exercises: user.exo,
            exo_log: user.exo_log,
            date_inscription: user.date_inscription
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.firstName, data.lastName, data.exo_log, data.date_inscription, data.exercises, data.genre);
    }
};
