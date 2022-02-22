import './myMap.css';
import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from "leaflet";
import STATIONS from "../data/stations.mock"


export default function MyMap(props)  {
  const [stationList, setStationList] = useState([]);
  useEffect(() => {
    if(!props.onChange) {
      setStationList(STATIONS);
    } else {
      const filtredStations = stationList.filter( station => {
        let flag = false;
        station.prix.map( p => {
           if(p._nom.includes(props.onChange)) flag = true;
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
        });
      } }>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />

      {stationList.map(station => (
        <Marker
          key={station._id}
          position={[
            station._latitude,
            station._longitude
          ]}
          icon={icon}
        >
          <Popup>
            Station: {station.adresse}
            {station.prix[0]._valeur}
            {station.prix.map(s => (
              <p>{s._nom}: {s._valeur}€</p>
            ))}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
