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
//# sourceMappingURL=app.js.map