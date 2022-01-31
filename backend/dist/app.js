"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var database_service_1 = require("./services/database.service");
var gases_router_1 = require("./routes/gases.router");
var app = express_1.default();
var port = 3000;
app.get('/', function (req, res) {
    res.send('The sedulous hyena ate the antelope!');
});
database_service_1.connectToDatabase()
    .then(function () {
    app.use("/gases", gases_router_1.gasesRouter);
    app.listen(port, function () {
        console.log("Server started at http://localhost:" + port);
    });
})
    .catch(function (error) {
    console.error("Database connection failed", error);
    process.exit();
});
