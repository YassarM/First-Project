// App.jsx
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import Axios from 'axios';
import Navbar from './Component/Navbar';
import { useAuth } from './AuthContext';
import { namaEvents } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Lazy loaded pages
const About = lazy(() => import('./pages/About'));
const InputNilai = lazy(() => import('./pages/InputNilai'));
const Contact = lazy(() => import('./pages/ContactPerson'));
const MoreInfo = lazy(() => import('./pages/MoreInfo'));
const Login = lazy(() => import('./pages/Login'));
const Logout = lazy(() => import('./pages/Logout'));
const Admin = lazy(() => import('./pages/RealAdminPage'));
const Panitia = lazy(() => import('./pages/Panitia'));
const ProtectedRoute = lazy(() => import('./Component/ProtectiveRoute'));
const JuriPage = lazy(() => import('./pages/JuriPage'));
const PelatihPage = lazy(() => import('./pages/PelatihPage'));
const HomePage = lazy(() => import('./pages/HomePage'));

function App() {

  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  const { user, loginStatus } = useAuth();
  const [namaEvent, setNamaEvent] = useState('');
  const navigate = useNavigate();
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    const handleUnload = () => {
      if (user?.id_user) {
        navigator.sendBeacon(
          `${API_BASE_URL}/user/${user.id_user}/active`,
          new Blob([JSON.stringify({ active: false })], { type: 'text/plain' }) // supaya header valid
        );

      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [user]);

  useEffect(() => {
    if (!loginStatus) {
      navigate('/login'); // atau halaman lain
    } else {
      const fecthNamaEvent = async () => {
        try {
          const res = await namaEvents(user.id_user);
          setNamaEvent(res.data.nama_event)
        } catch (err) {
          console.error(err)
        }
      }
      fecthNamaEvent()
    }
  }, [loginStatus]);

  const renderRoleRoutes = () => {
    switch (user?.role) {
      case 'Admin':
        return (
          <>
            <Route path={'/adminPage'} element={<Admin />} />
            <Route path="/juri-Page" element={<JuriPage />} />
            <Route path="/:event/Panitia-page" element={<Panitia />} />
            <Route path='*' element={<Navigate to={"/adminPage"} />} />
          </>
        );

      case 'Juri':
        return (
          <>
            <Route path='/' element={<Navigate to={'/' + namaEvent + '/juri-page'} />} />
            <Route path='/login' element={<Navigate to={'/' + namaEvent + '/juri-page'} />} />
            <Route path="/:event/juri-page" element={<JuriPage />} />
            <Route path="/:event/grade/:id" element={<InputNilai />} />
            <Route path="/rn" element={<Navigate to={'/' + namaEvent + '/juri-page'} />} />
            <Route path='*' element={<Navigate to={'/' + namaEvent + '/juri-page'} />} />
          </>
        );
      case 'Pelatih':
        return (
          <>
            <Route path="/pelatih-page" element={<PelatihPage />} />
            <Route path='/rekapNilai' element={<Navigate to="/pelatih-page" />} />
            <Route path='/' element={<Navigate to='/pelatih-page' />} />
            <Route path='/login' element={<Navigate to='/pelatih-page' />} />
            <Route path='*' element={<Navigate to='/pelatih-page' />} />
          </>
        );
      case 'Panitia':
        return (
          <>
            <Route path='/:event/Panitia-page' element={<Panitia />} />
            <Route path='*' element={<Navigate to={'/' + namaEvent + "/Panitia-page"} />} />
          </>
        );
      case 'Asjur':
        return (
          <>
            <Route path='/' element={<Navigate to={'/' + namaEvent + '/juri-page'} />} />
            <Route path='/login' element={<Navigate to={'/' + namaEvent + '/juri-page'} />} />
            <Route path="/:event/juri-page" element={<JuriPage />} />
            <Route path="/rn" element={<JuriPage />} />
          </>
        )
      default:
        return (<>
          <Route path="/" element={<HomePage />} />
          <Route path='/login' element={<Login />}></Route>
        </>
        )
    }
  };

  return (
    <>
      {!shouldHideNavbar && (
        <Navbar LoginStatus={loginStatus} Role={user?.role} username={user?.username} />
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {!loginStatus && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}

          <Route element={<ProtectedRoute isLoggedIn={loginStatus} />}>
            {renderRoleRoutes()}
            {/* <Route path="/leaderboard" element={<Home />} /> */}
            <Route path="/logout" element={<Logout />} />
          </Route>

          <Route path="/moreInfo" element={<MoreInfo />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;