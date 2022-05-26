
export class Exo {
    public cycles: number;
    public date: Timestamp;
    public description: string;
    public exercises: Item[] = [];
    public recovery_time: number;
    public rest_time: number;
    public time_total: number;
    public titre: string;
    public type: number;
    public useruid: number;
    public id: string;

    constructor(cycles: number, date: Timestamp, description: string, exercises: Item[],
        recovery_time: number, rest_time: number, time_total: number,
        titre: string, type: number, useruid: number, id: string) {
        this.cycles = cycles;
        this.date = date;
        this.description = description;
        this.exercises = exercises;
        this.recovery_time = recovery_time;
        this.rest_time = rest_time;
        this.time_total = time_total;
        this.titre = titre;
        this.type = type;
        this.useruid = useruid;
        this.id = id;
    }

    getMoreInfo() {
        return (
            <div>
                    <h4>Exercices</h4>
                    <ul>
                        {this.exercises.map(item => (
                            <li key={item.id}>{item.name}</li>
                        ))}
                    </ul>
            </div>
        )
    }

}

export const ExoConverter = {
    toFirestore: (a) => {
        return {
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Exo(data.cycles, data.date, data.description,
            data.exercises, data.recovery_time, data.rest_time,
            data.time_total, data.titre, data.type, data.useruid,"0");
    }
};