import mkdirp from "mkdirp";
import {buildServer} from "./build-server";
import {logger,closeFileLoggers} from "./utils/logger";
import {getData} from "./utils/api-fetcher";
import {api} from "./api";
mkdirp("./ressources/downlo___aded");
mkdirp("./mocks");
var apifetcher = require('./utils/api-fetcher')
buildServer((server) => logger.info(`Server is listening on port ${server.address().port}`));

process.on('exit', function() {
    closeFileLoggers()
});

/*getData(apifetcher.annee).then(function(json) {
    console.log(json.toString().substring(0,500))
})*/
