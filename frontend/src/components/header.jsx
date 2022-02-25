import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react';
import MyMap from './myMap';
import {loadFromList} from "../utils/addressLocator";
import {drawItinerary} from "../utils/itineraryCalculator";

export default function Header(mode) {
  const typeOfGas = ['SP98','SP95','Gazole'];
  const typeOfService = ['Lavage automatique', 'Lavage manuel', 'Boutique alimentaire', 'Station de gonflage', 'Boutique non alimentaire', 'Automate CB 24/24'];
  const [gasFilter, setGasFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [tileLayer, setTayelLayer] = useState('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

  useEffect(() => {
    if(mode.mode) {
        setTayelLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');
    } else {
        setTayelLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    }
  }, [mode]);

  let history = useHistory(); 
  const routeChange = () => {
    history.push("/signIn")
  }

  return (
        <><Box sx={{ flexGrow: 1 }}>
          <AppBar id="AppBar" position="static">
              <Toolbar>
                  <IconButton
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      sx={{ mr: 2 }}
                  >
                      <Avatar alt="Remy Sharp" src="https://www.ecologie.gouv.fr/sites/default/files/logo-carburants.jpg" />
                  </IconButton>
                  <Typography id="AppBarTypo" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      SmartCarburant
                  </Typography>
                  <input className={"address"} id={"fromAddress"} type="text" onKeyUp={loadFromList} placeholder="Où êtes-vous ?" list="fromList"/>

                  <datalist id="fromList">
                  </datalist>
                  <Autocomplete
                      disablePortal
                      id="carburant-box"
                      options={typeOfGas}
                      style={{ marginRight: '1%', marginTop: '5px' }}
                      sx={{ width: 200 }}
                      onChange={(event, value) => setGasFilter(value)}
                      renderInput={(params) => <TextField {...params} label="Carburants" />} />
                  <Autocomplete
                      disablePortal
                      id="service-box"
                      options={typeOfService}
                      style={{ marginRight: '5%', marginTop: '5px' }}
                      sx={{ width: 200 }}
                      onChange={(event, value) => setServiceFilter(value)}
                      renderInput={(params) => <TextField {...params} label="Services" />} />
                  <Button id="AppBarTypoButton" color="inherit" onClick={routeChange}>
                      Connexion
                  </Button>
              </Toolbar>
          </AppBar>
      </Box><MyMap displayMode={tileLayer} onChange={gasFilter} service={serviceFilter}/></>
  );
}