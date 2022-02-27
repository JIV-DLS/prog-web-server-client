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

import AccountCircle from "@mui/icons-material/AccountCircle";
import * as React from "react";
import Api from "../helper/api";
import {drawItinerary} from "../utils/itineraryCalculator";

const api = new Api();

export default function Header({mode,stations}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);
  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  useEffect(() => {
    
  }, [mode,stations]);

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
        //api.logout()
    };

    let user = localStorage.getItem("user")

    if (user)
        user = JSON.parse(user)

    return (    
        <Box sx={{ flexGrow: 1 }}>
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
                        onClick={handleMenu}
                            >
                            <Avatar alt="Remy Sharp" src="https://www.ecologie.gouv.fr/sites/default/files/logo-carburants.jpg" />
                    </IconButton>
                          <Menu
                              id="menu-appbar"
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                          >
                              <MenuItem onClick={mapRoute}>Map</MenuItem>
                              <MenuItem onClick={listeRoute}>Liste</MenuItem>
                              <MenuItem onClick={grapheRoute}>Graphe</MenuItem>
                          </Menu>
                      </div>
                  <Typography id="AppBarTypo" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      SmartCarburant
                  </Typography>

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
      </Box>
  );
}
