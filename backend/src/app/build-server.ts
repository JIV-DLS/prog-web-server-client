import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import httpS from "http";
import morgan from "morgan";
import path from "path";
import {api} from "./api";
import { RessourcesAndRoutes } from "./models/ressourcesAndRoutes";

import {getData} from "./utils/api-fetcher";

import mongoose from "mongoose";
import * as dotenv from "dotenv";

import {logger} from "src/app/utils/logger.ts"

const cron = require('node-cron');

cron.schedule('*/5 * * * *', () => {
  console.log('running a task in 5 minutes');
  fetch_data_from_server();
})

function fetch_data_from_server() {
  const file_url = 'https://donnees.roulez-eco.fr/opendata/annee/2022';

  getData(file_url).then(function (json) {
    //console.log("raw xml : " + rawXML.toString());
    //console.log('JSon :  ', json.toString().substring(0,1000));
    if (typeof json === "string") {
      var jsonObject = JSON.parse(json)
    }
    var pdv_list = jsonObject.elements[0].elements
    console.log(pdv_list[0])

  })
}

export const buildServer = (cb) => {
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

          fetch_data_from_server();


          const server = http.listen(process.env.PORT || 9428, () => cb && cb(server));

        })
        // tslint:disable-next-line:no-console
        .catch(() => logger.error("Connexion à MongoDB échouée !"));

  }
  else{
    logger.error("la variable DB_CONN_STRING est introuvable!");
  }

  // const server = app.listen(process.env.PORT || 9428, () => cb && cb(server))
};
