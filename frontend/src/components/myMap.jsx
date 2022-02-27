import './myMap.css';
import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents , Polyline} from 'react-leaflet';
import { Icon , LatLng, polyline} from "leaflet";
// import STATIONS from "../data/stations.mock"
import { popupContent, popupHead, popupText, okText } from "./popupStyles";
import {modifyPrice, getOldPrice} from "../utils/priceEditor"
import {askOneAdress} from "../utils/addressLocator";


var center = new LatLng(43.7101728, 7.2619532, 0);
var STATIONS = [];
var POLYLINE = [];
const polyLine = [
  [47.89540903698003, 16.307462373367308],
  [48.845072,6.592791]
];
var tempPoly = [];

var mapA;


var openroute_api_key = "5b3ce3597851110001cf624802362b6174e54aa98a8f502fe809cafc";

export async function getItinerary(startXString, startYString, endXString, endYString){
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        let A;
        var url = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + openroute_api_key + "&start="+startXString+","+startYString+"&end="+endXString+","+endYString;
        console.log("sent request :" + url);
        xhr.open("GET",url, true);
        xhr.send();
        xhr.onload = () => {
            A = JSON.parse(xhr.responseText);
            console.log(A)
            resolve(A);
        }
    });
}

export async function drawItinerary(endXString, endYString) {
    var address = await askOneAdress(document.getElementById("fromList").firstChild.value);
    console.log("Adressse Dans la Map ",address);
    var startYString = address.features[0].geometry.coordinates[1];
    var startXString = address.features[0].geometry.coordinates[0];
    if(startXString === "" || startYString === ""){
        alert("Please enter a valid input");
        return;
    }

    var itinerary = await getItinerary(startXString, startYString, endXString, endYString)
    for (var i = 1; i < itinerary.features[0].geometry.coordinates.length; i++) {
        drawLine(itinerary.features[0].geometry.coordinates[i][1], itinerary.features[0].geometry.coordinates[i][0], itinerary.features[0].geometry.coordinates[i - 1][1], itinerary.features[0].geometry.coordinates[i - 1][0], '#6f79c9');
    }
    console.log("zabii",polyLine);
}

function drawLine(fromX, fromY, toX, toY, color){
    POLYLINE.push([fromX,fromY]);
    POLYLINE.push([toX,toY]);
    //console.log("Drawing [" + fromX+", " + fromY +"] to [" + toX + ", " + toY + "]");
}


export default function MyMap(props) {
  const [stationList, setStationList] = useState([]);
  useEffect(() => {
    
    STATIONS = props.stations;
    setStationList(STATIONS);
    console.log("map: ",STATIONS);
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
          //console.log(map.target.getCenter());
          center = map.target.getCenter();
          props.updateCenter(center);
          
        });
      } }>
      <TileLayer
       url= 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
       attribution= '&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors'
      />

      <Polyline positions={POLYLINE} />

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
                <button className="itineraryButton" onClick={() => drawItinerary(station.longitude,station.latitude)}>Itinéraire</button>
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