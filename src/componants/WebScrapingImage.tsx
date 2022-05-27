import { useEffect } from "react";


async function fetchData(url : string) {
   /* var headers = {}
    const rep = await fetch(url);
    const data = await rep.text();

   // const $ = cheerio.load(data);
    console.log(rep);*/
}


const Webscrap = () => 
{

    useEffect(() => {
        //web scrapping
        const url = "https://www.grandpalais.fr/en"
        fetchData(url);


    }, [])

    return (

        <div>
            oui
        </div>
    )

}
export default Webscrap;