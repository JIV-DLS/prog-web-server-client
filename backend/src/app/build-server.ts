import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import httpS from "http";
import https from "https";
import morgan from "morgan";
import path from "path";
import {api} from "./api";
import { RessourcesAndRoutes } from "./models/ressourcesAndRoutes";

import fs, {mkdirSync} from "fs";

import {getData} from "./utils/api-fetcher";

import mongoose from "mongoose";
import * as dotenv from "dotenv";

import {logger, loggerToFile} from "./utils/logger"
import {Station} from "./models/station.model";
import {Gas} from "./models/gas.model";
import {Service} from "./models/service.model";


const cron = require('node-cron');

cron.schedule('0 7 * * *', () => {
  console.log('running an automatic task...');
  fetch_data_from_server("instantane");
})


function save_services(services) {
  if(!services)return
  for (let j = 0; j < services.length; j++) {
    if (services[j].length <3) continue
    Service.findOne({"label": services[j]}, function (err, service) {
      if (!err) {
        if (!service) {
          service = new Service();
          loggerToFile.log("Adding new Service...");
          service["label"] = services[j];

          service.save(function (err) {
            if (!err) {
              loggerToFile.log("Service " + service["id"] + " created at " + service.createdAt + " updated at " + service.updatedAt);
            } else {
              loggerToFile.log("Error: could not save station " + service["id"]);
            }
          });
        }
      }
    });
  }
}

function save_gases(prices) {
  if (!prices)return
  for (let j = 0; j < prices.length; j++) {

    if (prices[j]["nom"].length <3) continue
    Gas.findOne({"name": prices[j]["nom"]}, function (err, gas) {
      if (!err) {
        if (!gas) {
          gas = new Gas();
          loggerToFile.log("Adding new Gas...");
          gas["name"] = prices[j]["nom"];

          gas.save(function (err) {
            if (!err) {
              loggerToFile.log("Gas " + gas["id"] + " created at " + gas.createdAt + " updated at " + gas.updatedAt);
            } else {
              loggerToFile.log("Error: could not save station " + gas["id"]);
            }
          });
        }
      }
    });
  }
}

function fetch_data_from_server(url=null) {

  if(!url){
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const oldestKnownDate = 2020;
    url = "annee/"+currentYear
  }


  getData(url).then(function (json) {

    //console.log("raw xml : " + rawXML.toString());
    //console.log('JSon :  ', json.toString().substring(0,1000));

    if (typeof json === "string") {
      var jsonObject = JSON.parse(json)
    }
    //var pdv_list = jsonObject.elements[0].elements

    const pdvs = jsonObject["pdv_liste"]["pdv"]

    for (let i = 0; i < pdvs.length; i++) {


      setTimeout(function(){

        loggerToFile.log("Adding",pdvs[i]["id"],"...")

        /*setTimeout(function(){save_gases(pdvs[i]["prix"]);}, 60000+i*5000);
        setTimeout(function(){save_gases(pdvs[i]["rupture"]);}, 90000+i*5000);
        setTimeout(function(){save_services(pdvs[i]["services"]["service"]);}, 120000+i*5000);*/

        Station.findOne({"id":pdvs[i]["id"]}, function(err, pdv) {
          if(!err) {
            if(!pdv) {
              pdv = new Station();
              loggerToFile.log("Adding new Station...");
              pdv["id"] = pdvs[i]["id"];
            }
            pdv["pdv_content"] = pdvs[i];
            pdv.save(function(err) {
              if(!err) {
                loggerToFile.log("Station " + pdv["id"] + " created at " + pdv.createdAt + " updated at " + pdv.updatedAt);
              }
              else {
                loggerToFile.log("Error: could not save station " + pdv["id"]);
              }
            });
          }
        });}, 1);

    }
    console.log('pdvs size : ' + pdvs.length)
    //
    //console.log("New version",json.toString())

  }).catch((error) => {
    console.error(`error gotten...retrying in 5min`,error);
    loggerToFile.log(`error gotten...retrying in 5min`,error);
    setTimeout(function(){fetch_data_from_server();}, 300000);
  });
  /*
  for (let i = currentYear; i < oldestKnownDate; i--) {
    console.log("=>_______",i)



  }*/


}

export const buildServer = (cb) => {
  const app = createServer();

  const http = new httpS.Server(app);
  // const io = socketIO(http);

  const posts = {};

  /*io.on("connection", (socket) => {
    let previousId;
    const safeJoin = (currentId) => {
      socket.leave(previousId);
      socket.join(currentId);
      previousId = currentId;
    };

    socket.on("getDoc", (postId) => {
      safeJoin(postId);
      socket.emit("post", posts[postId]);
    });

    socket.on("addDoc", (doc) => {
      posts[doc.id] = doc;
      safeJoin(doc.id);
      io.emit("posts", Object.keys(posts));
      socket.emit("post", doc);
    });

    socket.on("editPost", (doc) => {
      posts[doc.id] = doc;
      socket.to(doc.id).emit("post", doc);
    });

    io.emit("posts", Object.keys(posts));
  });*/


  dotenv.config();
  if (process.env.DB_CONN_STRING){
    // tslint:disable-next-line:max-line-length

    logger.info("Connexion à la BD ",process.env.DB_CONN_STRING," ...");

    mongoose.connect(process.env.DB_CONN_STRING,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          // tslint:disable-next-line:no-console
          logger.info("Connexion à MongoDB réussie !");
          mongoose.set("useNewUrlParser", true);
          mongoose.set("useFindAndModify", false);
          mongoose.set("useCreateIndex", true);

          //fetch_data_from_server();

          const privateKey  = fs.readFileSync('./certificate/server.key', 'utf8');
          const certificate = fs.readFileSync('./certificate/server.crt', 'utf8');

          const credentials = {key: privateKey, cert: certificate};

          //const server = http.listen(process.env.PORT || 9428, () => cb && cb(server));

          const SECURED_PORT = process.env.PORT || 9428;
          console.log("Launching secured server")
          const secured_server = https.createServer(credentials, app);

          const secured_server_launched = secured_server.listen(SECURED_PORT,() => cb && cb(secured_server_launched));
        })
        // tslint:disable-next-line:no-console
        .catch((err) => {
          logger.error(err)
          logger.error("Connexion à MongoDB échouée !")
        });

  }
  else{
    logger.error("la variable DB_CONN_STRING est introuvable!");
  }

  // const server = app.listen(process.env.PORT || 9428, () => cb && cb(server))
};
export function createServer() {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors());
  app.use(bodyParser.json({}));
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
      "Origin," +
      " X-Requested-With," +
      " Content, " +
      "Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
  });
  app.use(morgan("[:date[iso]] :method :url :status :response-time ms - :res[content-length]"));
  app.use("/fonts", express.static(path.join(__dirname, `../${RessourcesAndRoutes.fonts}`)));
  app.use("/model_images", express.static(path.join(__dirname, `../${RessourcesAndRoutes.model_images}`)));
  app.use("/images", express.static(path.join(__dirname, `../${RessourcesAndRoutes.images}`)));
  app.use("/api", api);
  app.use("*", (req, res) => res.status(404).end());
  return app;
}

