
import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import logo from '../assets/logo.png';
function NavBar({ setLoginStatus, Role }) {
    return (
        <>
            <div className='navbar-phone'>
                <Link to="/" className='logo'>
                    <img src={logo} alt="logo" /></Link>
                <div className="navbar-list-phone">
                    <Link to="/" className="home" >Home</Link>
                    <Link to="/about" className="about">About</Link>
                    {Role === 'Juri' && <Link to="/rekapNilai" className="rekap-nilai">Rekap Nilai</Link>}
                    <Link to="/contact" className="Contact">Contact Person</Link>
                    <Link to="/login" className="LogIn">Log In</Link>
                    {Role === 'Admin' && <Link to="/adminPage" className="Admin">Admin Page</Link>}
                    {setLoginStatus && <Link to="/logout" className="LogOut">Log Out</Link>}
                </div>
                <Link to="/moreInfo" className="more-info">More Info</Link>
            </div>
            <div className="navbar-container">
                <Link to="/login" className='logo'>
                    <img src={logo} alt="logo" /></Link>
                <div className="navbar-list">
                    <Link to="/" className="home" >Home</Link>
                    <Link to="/about" className="about">About</Link>
                    {Role === 'Juri' && <Link to="/rekapNilai" className="rekap-nilai">Rekap Nilai</Link>}
                    <Link to="/contact" className="Contact">Contact Person</Link>
                    {Role === 'Admin' && <Link to="/adminPage" className="Admin">Admin Page</Link>}
                    {setLoginStatus && <Link to="/logout" className="LogOut">Log Out</Link>}
                </div>
                <Link to="/moreInfo" className="more-info">More Info</Link>
            </div>
        </>
    )
}

export default NavBar;