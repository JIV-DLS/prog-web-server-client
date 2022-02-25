import './myMap.css';
import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents , Polyline} from 'react-leaflet';
import { Icon , LatLng} from "leaflet";
import STATIONS from "../data/stations.mock"
import { popupContent, popupHead, popupText, okText } from "./popupStyles";
import {getItinerary,testmethod, testmethod2, testmethod3, drawItinerary} from "../utils/itineraryCalculator";


var center = new LatLng(43.7101728, 7.2619532, 0);
var mapA;


export default function MyMap(props) {
  const [stationList, setStationList] = useState([]);
  useEffect(() => {
    if(!props.onChange && !props.service) {
      setStationList(STATIONS);
    } else if (props.onChange) {
      const filtredStations = stationList.filter( station => {
        let flag = false;
        station.prix.map( p => {
           if(p._nom.includes(props.onChange)) flag = true;
         })
         return flag;
      }
      );
      setStationList(filtredStations);
    } else {
      const filtredStations = stationList.filter( station => {
        let flag = false;
        station.services.service.map( s => {
           if(s.includes(props.service)) flag = true;
         })
         return flag;
      }
      );
      setStationList(filtredStations);
    }

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
       url= {props.displayMode}
       attribution= '&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors'
      />
      {stationList.map(station => (
        <Marker
          key={station._id}
          position={[
            station._latitude,
            station._longitude
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

                <button onClick={() => drawItinerary(station._longitude,station._latitude)}>Itinéraire</button>

                <div className="m-2" style={popupHead}>
                Les carburants :
              </div>
               {station.prix.map(p => (
              <p>{p._nom}: {p._valeur}€</p>
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
