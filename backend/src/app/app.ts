import mkdirp from "mkdirp";
import {buildServer} from "./build-server";
import {logger} from "./utils/logger";
mkdirp("./ressources/downloaded");
mkdirp("./mocks");
buildServer((server) => logger.info(`Server is listening on port ${server.address().port}`));

