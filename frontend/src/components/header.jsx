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

export default function Header() {
  const typeOfGas = ['SP98','SP95','Diesel'];
  const typeOfService = ['Lavage automatique', 'Lavage','Air pneu','Restaurant'];
  let history = useHistory(); 
  const routeChange = () => {
    history.push("/signIn")
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SmartCarburant
          </Typography>
          <Autocomplete
            disablePortal
            id="carburant-box"
            options={typeOfGas}
            style={{marginRight: '1%'}}
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label="Carburants" />}
          />
          <Autocomplete
            disablePortal
            id="service-box"
            options={typeOfService}
            style={{marginRight: '5%'}}
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label="Services" />}
          />
          <Button color="inherit" onClick={routeChange}>
              Connexion
           </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}