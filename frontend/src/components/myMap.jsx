import './myMap.css';
import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents , Polyline} from 'react-leaflet';
import { Icon , LatLng, polyline} from "leaflet";
import { popupContent, popupHead, popupText, okText } from "./popupStyles";
import {modifyPrice, getOldPrice} from "../utils/priceEditor"
import {askOneAdress} from "../utils/addressLocator";
import {drawItinerary} from "../utils/itineraryCalculator";

var center = new LatLng(43.7101728, 7.2619532, 0);
var STATIONS = [];
var POLYLINE = [];
const polyLine = [
  [47.89540903698003, 16.307462373367308],
  [48.845072,6.592791]
];

var openroute_api_key = "5b3ce3597851110001cf624802362b6174e54aa98a8f502fe809cafc";


export default function MyMap(props) {
  const [stationList, setStationList] = useState([]);
  const [itinerary, setItinerary] = useState([]);
    //console.log("Current position",props.currentPosition);
  useEffect(() => {

    STATIONS = props.stations;
    setStationList(STATIONS);
    if(!props.onChange && !props.service) {
      setStationList(STATIONS);
    } else if (props.onChange) {
      const filtredStations = stationList.filter( station => {
        let flag = false;
        station.prix.map( p => {
           if(p.nom.includes(props.onChange)) flag = true;
         })
         return flag;
      }
      );
      setStationList(filtredStations);
    } else {
      const filtredStations = stationList.filter( station => {
        let flag = false;
        if( station.services){
          let services = station.services.service;
          for(let i = 0; i < services.length; i++) {
            if(services[i].includes(props.service)) {
              flag = true;
            }
          }
        }

        return flag;

      }
      );
      console.log(filtredStations);
      setStationList(filtredStations);
    }
  }, [props]);

  const icon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/784/784867.png",
    iconSize: [35, 35]
  });

    const currentPositionIcon = new Icon({
        iconUrl: "https://img.icons8.com/ios/50/000000/place-marker--v1.png",
        iconSize: [35, 35]
    });
    //<a href="https://icons8.com/icon/89368/place-marker">Place Marker icon by Icons8</a>
  function NumberList(props) {
    const numbers = props.numbers;
    const listItems = numbers.map((number) =>
      <li key={number.toString()}>
        {number}
      </li>
    );
    return (
      <ul>{listItems}</ul>
    );
  }


  return (
    <MapContainer
      center={[43.7101728, 7.2619532]}
      zoom={13}
      scrollWheelZoom={true}
      whenReady={(map) => {
        map.target.on("move", function (e) {
          center = map.target.getCenter();
          props.updateCenter(center);

        });
      } }>
      <TileLayer
       url= 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
       attribution= '&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors'
      />

      <Polyline positions={POLYLINE} />
        {props.currentPosition?
            <Marker
                key="currentPosition"
                position={[
                    props.currentPosition.coords.latitude,
                    props.currentPosition.coords.longitude
                ]}
                icon={currentPositionIcon}
            />
            :
            <Marker
                key="currentPosition"
                position={[
                    0,
                    0
                ]}
                icon={currentPositionIcon}
            />
        }
        {itinerary.map(line =>(
                <Polyline
                    positions = {[line[0],line[1]]}
                />
            )
        )}
      {stationList.map(station => (
        <Marker
          key={station.id}
          position={[
            station.latitude,
            station.longitude
          ]}
          icon={icon}
        >
          <Popup className="request-popup">
          <div style={popupContent}>
            <img
              src="https://www.ecologie.gouv.fr/sites/default/files/logo-carburants.jpg"
              width="80"
              height="50"
              alt="no img"
            />
            <div className="m-2" style={okText}>
              <div className="m-2" style={popupHead}>
                Station :
              </div>
               {station.adresse}

            </div>
            <div className="m-2" style={okText}>
                <button className="itineraryButton" onClick={() => {
                    drawItinerary(props.currentPosition,station.longitude, station.latitude).then((lines)=>{
                        setItinerary(lines)
                    }).catch((error)=>console.log(error))
                }}>Itinéraire</button>
                <div className="m-2" style={popupHead}>
                Les carburants :
              </div>
               {station.prix.map(p => (
                   <div className="price">
                       <b>{p.nom}: </b>
                        <div className="pricerow">
                            <div className="pricetag" id={"editValue-"+ p.nom + "-" + station.id} contentEditable={false}>{p.valeur} €</div>
                            <div className="priceEdit"><button id={"editButton-" + station.id}  title="Corriger le prix" disabled={true} className="priceEditButton" onClick={() => modifyPrice(station.id, p.nom, document.getElementById("editValue-" + p.nom + "-" + station.id).innerText)}>Modifier</button></div>
                            <div className="oldPrice"><button id={"oldPriceButton-" + station.id} title="Afficher l'ancien prix" disabled={true} className="oldPriceButton" onClick={() => getOldPrice(station.id, p.nom)}>Ancien prix</button></div>
                        </div>
                   </div>
              ))}
              <div className="m-2" style={popupHead}>
                Les services :
              </div>
              <NumberList numbers={station.services.service} />
            </div>
          </div>
        </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
