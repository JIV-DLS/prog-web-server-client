import {loadFromList} from "../utils/addressLocator";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react';
import MyMap from './myMap';

import AccountCircle from "@mui/icons-material/AccountCircle";
import * as React from "react";
import Api from "../helper/api";
import {drawItinerary} from "../utils/itineraryCalculator";

const api = new Api();


export default function Header({mode,stations}) {

  const typeOfGas = ['SP98','SP95','Gazole'];
  const typeOfService = ['Lavage automatique', 'Lavage manuel', 'Boutique alimentaire', 'Station de gonflage', 'Boutique non alimentaire', 'Automate CB 24/24'];
  const [gasFilter, setGasFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [tileLayer, setTayelLayer] = useState('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    if(mode.mode) {
        setTayelLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');
    } else {
        setTayelLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    }
    
  }, [mode,stations]);

  let history = useHistory();
  const routeChange = () => {
    history.push("/signIn")
  }

    const handleClose = () => {
        setAnchorEl(null);
        history.push("/")
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const logout = (event) => {
        //api.logout()
    };

    let user = localStorage.getItem("user")

    if (user)
        user = JSON.parse(user)

    console.log("in Header",user);
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

                  { !user ?
                      <Button id="AppBarTypoButton" color="inherit" onClick={routeChange}>
                      Connexion
                  </Button>
                      :
                      <div>
                          <IconButton
                              size="large"
                              aria-label="account of current user"
                              aria-controls="menu-appbar"
                              aria-haspopup="true"
                              onClick={handleMenu}
                              color="inherit"
                          >
                              <AccountCircle style={{color:mode? 'gray' : 'white'}}/>
                          </IconButton>
                          <Menu
                              id="menu-appbar"
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                          >
                              <MenuItem onClick={handleClose} disabled={true}>Profile</MenuItem>
                              <MenuItem onClick={logout}>Logout</MenuItem>
                          </Menu>
                      </div> }

              </Toolbar>
          </AppBar>
      </Box><MyMap displayMode={tileLayer} onChange={gasFilter} service={serviceFilter}/></>
  );
}
