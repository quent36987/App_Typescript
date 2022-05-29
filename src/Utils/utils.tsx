

export function StringSymplify(name : string)
{
        var name_modif = name.replace(/\((.)*\)/g,"")
        .replace(/([0-9]+[\s]*([àaou]|ou)[\s]*[0-9]+)*/g,"")
        .replace(/[\s\d-+'*]/g, "").toLocaleLowerCase().
        normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (name_modif.endsWith("s")) {
            name_modif = name_modif.substring(0, name_modif.length - 1);
        }
        return name_modif;
}

export function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
        return `${minutes}:0${seconds}`
    }
    return `${minutes}:${seconds}`;
}