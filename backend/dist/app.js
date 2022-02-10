"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mkdirp_1 = __importDefault(require("mkdirp"));
const build_server_1 = require("./build-server");
const logger_1 = require("./utils/logger");
mkdirp_1.default("./ressources/downloaded");
mkdirp_1.default("./mocks");
build_server_1.buildServer((server) => logger_1.logger.info(`Server is listening on port ${server.address().port}`));
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
//# sourceMappingURL=app.js.map