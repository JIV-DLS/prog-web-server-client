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


export default function Header({mode,stations,token,onChange,currentPosition}) {

  const typeOfGas = ['SP98','SP95','Gazole'];
  const typeOfService = ['Lavage automatique', 'Lavage manuel', 'Boutique alimentaire', 'Station de gonflage', 'Boutique non alimentaire', 'Automate CB 24/24'];
  const [gasFilter, setGasFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [user, setUser] = useState();

  const handleNavMenu = (event) => {
    setAnchorE2(event.currentTarget);
};
  const handleCloseMenu = () => {
    setAnchorE2(null);
};

    let history = useHistory();
    const routeChange = () => {
        history.push("/signIn")
    }

    const mapRoute = () => {
        history.push("/")
      }

      const listeRoute = () => {
        history.push("/dataTable")
      }

      const grapheRoute = () => {
        history.push("/chart")
      }

    const handleClose = () => {
        setAnchorEl(null);
        history.push("/")
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const logout = (event) => {
        api.logout()
        setUser(null)
        handleClose();

    };


    function loadUserFromApi() {
        api.getUserInfo().then((_user) => {
            localStorage.setItem("user", JSON.stringify(_user));
            //user = _user;
            setUser(_user);
        });
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        let userSaved = localStorage.getItem("user")
        if (token) {
            if (userSaved == null) {
                loadUserFromApi();
            } else {
                const _ = JSON.parse(userSaved);
                //user = _;
                setUser(_);
            }
        }
    }, [onChange])

    return (
        <><Box sx={{ flexGrow: 1 }}>
          <AppBar id="AppBar" position="static">
              <Toolbar>

              <div>
                        <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleNavMenu}
                            >
                            <Avatar alt="Remy Sharp" src="https://www.ecologie.gouv.fr/sites/default/files/logo-carburants.jpg" />
                    </IconButton>
                          <Menu
                              id="menu-appbar"
                              anchorEl={anchorE2}
                              open={Boolean(anchorE2)}
                              onClose={handleCloseMenu}
                          >
                              <MenuItem onClick={mapRoute}>Map</MenuItem>
                              <MenuItem onClick={listeRoute}>Liste</MenuItem>
                              <MenuItem onClick={grapheRoute}>Graphe</MenuItem>
                          </Menu>
                      </div>

                  <Typography id="AppBarTypo" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      SmartGas
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

                  {!user?
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
                              <AccountCircle style={{color: mode ? 'white' : 'gray'}}/>
                          </IconButton>
                          <Menu
                              id="menu-appbar"
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                          >
                              <MenuItem onClick={handleClose}
                                        disabled={true}>{user["firstName"] + " " + user["lastName"]}</MenuItem>
                              <MenuItem onClick={logout}>Logout</MenuItem>
                          </Menu>
                      </div>}

              </Toolbar>
          </AppBar>
      </Box><MyMap  onChange={gasFilter} service={serviceFilter} stations={stations} updateCenter={onChange} currentPosition={currentPosition}/></>
  );
}
