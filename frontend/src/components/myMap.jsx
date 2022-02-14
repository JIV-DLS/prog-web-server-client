import './myMap.css';
import React, {useState} from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from "leaflet";


function MyMap() {

  

  const [activePark, setActivePark] = useState(null);
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
            console.log(map.target.getCenter())
}
          );
        }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  />
       <Marker
          position={[
            43.7101728,
            7.2619532
          ]}
          icon={icon}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup> 
        </Marker>

      {activePark && (
        <Popup
          position={[
            45.323,
            -75.25
          ]}
          onClose={() => {
            setActivePark(null);
          }}
        >
          <div>
            <h2>{activePark.properties.NAME}</h2>
            <p>{activePark.properties.DESCRIPTIO}</p>
          </div>
        </Popup>
      )}
</MapContainer>
  );
}

export default MyMap;