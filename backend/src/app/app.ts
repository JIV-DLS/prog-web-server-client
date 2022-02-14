import mkdirp from "mkdirp";
import {buildServer} from "./build-server";
import {logger} from "./utils/logger";
import {getData} from "./utils/api-fetcher";
mkdirp("./ressources/downloaded");
mkdirp("./mocks");
buildServer((server) => logger.info(`Server is listening on port ${server.address().port}`));

var file_url = 'https://donnees.roulez-eco.fr/opendata/annee/2022';

getData(file_url).then(function(json) {

})