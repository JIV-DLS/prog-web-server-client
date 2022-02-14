"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mkdirp_1 = __importDefault(require("mkdirp"));
const build_server_1 = require("./build-server");
const logger_1 = require("./utils/logger");
const api_fetcher_1 = require("./utils/api-fetcher");
mkdirp_1.default("./ressources/downloaded");
mkdirp_1.default("./mocks");
build_server_1.buildServer((server) => logger_1.logger.info(`Server is listening on port ${server.address().port}`));
var file_url = 'https://donnees.roulez-eco.fr/opendata/annee/2022';
api_fetcher_1.getData(file_url).then(function (json) {
});
//# sourceMappingURL=app.js.map