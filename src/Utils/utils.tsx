

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