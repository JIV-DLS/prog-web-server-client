import './myMap.css';
import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents , Polyline} from 'react-leaflet';
import { Icon , LatLng} from "leaflet";
// import STATIONS from "../data/stations.mock"
import { popupContent, popupHead, popupText, okText } from "./popupStyles";
import {drawItinerary} from "../utils/itineraryCalculator";
import {modifyPrice, getOldPrice} from "../utils/priceEditor"

var center = new LatLng(43.7101728, 7.2619532, 0);
var STATIONS = [];
var mapA;

export default function MyMap({props}) {
  const [stationList, setStationList] = useState([]);
  useEffect(() => {
    STATIONS = props.stations;
    setStationList(STATIONS);
    console.log("map: ",STATIONS)

    // if(!props.onChange && !props.service) {
    //   setStationList(STATIONS);
    // } else if (props.onChange) {
    //   const filtredStations = stationList.filter( station => {
    //     let flag = false;
    //     station.prix.map( p => {
    //        if(p._nom.includes(props.onChange)) flag = true;
    //      })
    //      return flag;
    //   }
    //   );
    //   setStationList(filtredStations);
    // } else {
    //   const filtredStations = stationList.filter( station => {
    //     let flag = false;
    //     station.services.service.map( s => {
    //        if(s.includes(props.service)) flag = true;
    //      })
    //      return flag;
    //   }
    //   );
    //   setStationList(filtredStations);
    // }
  }, [props]);

  const icon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/784/784867.png",
    iconSize: [20, 20]
  });

  return (
    <MapContainer
      center={[43.7101728, 7.2619532]}
      zoom={13}
      scrollWheelZoom={true}
      whenReady={(map) => {
        map.target.on("move", function (e) {
          console.log(map.target.getCenter());
          center = map.target.getCenter();
        });
      } }>
      <TileLayer
       url= 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
       attribution= '&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors'
      />
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
               {station.latitude}
               <br/>
              
               {station.longitude}
            </div>
            <div className="m-2" style={okText}>
                <button className="itineraryButton" onClick={() => drawItinerary(station._longitude,station._latitude)}>Itinéraire</button>
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
               {station.services.service.map(s => (
              <p>{s}</p>
              ))}
            </div>
          </div>
        </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
