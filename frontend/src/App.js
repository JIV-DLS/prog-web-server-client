import React from 'react';
import './App.css';
import MyMap from './componenents/myMap';

function App() {

  const mapIsReadyCallback = (map) => {
    console.log(map);
  };

  return (
    <MyMap mapIsReadyCallback={mapIsReadyCallback}/>
  );
}

export default App;