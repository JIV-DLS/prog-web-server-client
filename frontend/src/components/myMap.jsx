import './myMap.css';
import React, {useState} from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { Icon } from "leaflet";
import STATIONS from "../data/stations.mock"

function MyMap() {
  const [activeStation, setActiveStation] = useState(null);
  const stationList = STATIONS; 
  const icon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/784/784867.png",
    iconSize: [20, 20]
  });

  return (
  <MapContainer center={[43.677, 7.226]} zoom={12} scrollWheelZoom={true}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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

export default MyMap;