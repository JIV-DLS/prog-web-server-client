import mkdirp from "mkdirp";
import {buildServer} from "./build-server";
import {logger} from "./utils/logger";
import {getData} from "./utils/api-fetcher";
mkdirp("./ressources/downloaded");
mkdirp("./mocks");
buildServer((server) => logger.info(`Server is listening on port ${server.address().port}`));

/*var file_url = 'https://donnees.roulez-eco.fr/opendata/annee/2022';

getData(file_url).then(function(json) {
    //console.log("raw xml : " + rawXML.toString());
    //console.log('JSon :  ', json.toString().substring(0,1000));
    if (typeof json === "string") {
        var jsonObject = JSON.parse(json)
    }
    var pdv_list = jsonObject.elements[0].elements
    console.log(pdv_list[0])

})*/