export type Item = {
    id: number;
    name: string;
    time: number;
    type: number; //0 exo  1 rest  2 cycle
    time_inf:boolean;

    time_bis?: number;
    cycles?: number;
}