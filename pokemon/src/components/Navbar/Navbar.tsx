import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import "./Navbar.css";

const Navbar = () => {
  return (
    <AppBar position="fixed" className='navbar'>
      <Toolbar>
        <a href="/">
          <img src="data:image/png;base64,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"
            alt="Logo"
            className="logo"
            style={{ width: '40px', height: '40px', borderRadius: '100%', display: 'flex', marginRight: '10px' }} />
        </a>
        <nav>
          <Button className="navButton" component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button className="navButton" component={Link} to="/pokemon" color="inherit">
            Pokemon List
          </Button>
          <Button className="navButton" component={Link} to="/my-pokemon" color="inherit">
            My Pokemon List
          </Button>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;