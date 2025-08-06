// App.jsx
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Suspense, lazy, useEffect  } from 'react';
import Axios from 'axios';
import Navbar from './Component/Navbar';
import { useAuth } from './AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const InputNilai = lazy(() => import('./pages/InputNilai'));
const Contact = lazy(() => import('./pages/ContactPerson'));
const MoreInfo = lazy(() => import('./pages/MoreInfo'));
const Login = lazy(() => import('./pages/Login'));
const SignIn = lazy(() => import('./pages/SignIn'));
const AddRekapNilai = lazy(() => import('./pages/AddRekapNilai'));
const Logout = lazy(() => import('./pages/Logout'));
const Admin = lazy(() => import('./pages/Admin'));
const EditUser = lazy(() => import('./Component/EditUser'));
const AddUser = lazy(() => import('./Component/AddUser'));
const ProtectedRoute = lazy(() => import('./Component/ProtectiveRoute'));
const JuriPage = lazy(() => import('./pages/JuriPage'));
const PelatihPage = lazy(() => import('./pages/PelatihPage'));
const HomePage = lazy(() => import('./pages/HomePage'));

function App() {
  const { user, loginStatus } = useAuth();
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
    }
}, [loginStatus]);

  const renderRoleRoutes = () => {
    switch (user?.role) {
      case 'Admin':
        return (
          <>
            <Route path='/adminPage' element={<Admin />} />
            <Route path="/juri-Page" element={<JuriPage />} />
            <Route path="/editUser/:id" element={<EditUser />} />
            <Route path="/addUser" element={<AddUser />} />
            <Route path='*' element={<Navigate to="/adminPage" />} />
          </>
        );
      case 'Juri':
        return (
          <>
            <Route path='/' element={<Navigate to='/juri-page' />} />
            <Route path='/login' element={<Navigate to='/juri-page' />} />
            <Route path="/juri-page" element={<JuriPage />} />
            <Route path="/grade/:id" element={<InputNilai />} />
            <Route path="/rn" element={<JuriPage />} />
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
            <Route path='adminPage' element={<Admin />} />
            <Route path="/editUser/:id" element={<EditUser />} />
            <Route path="/addUser" element={<AddUser />} />
            <Route path='*' element={<Navigate to="/adminPage" />} />
          </>
        );
      case 'Asjur':
        return (
          <>
            <Route path='/' element={<Navigate to='/juri-page' />} />
            <Route path='/login' element={<Navigate to='/juri-page' />} />
            <Route path="/juri-page" element={<JuriPage />} />
            <Route path="/rn" element={<JuriPage />} />
          </>
        )
      default:
        return (<>
          <Route path="/" element={<HomePage />} />
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<SignIn/>}></Route>
        </>
        )
    }
  };

  return (
    <>
      <Navbar setLoginStatus={loginStatus} Role={user?.role} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {!loginStatus && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignIn />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}

          <Route element={<ProtectedRoute isLoggedIn={loginStatus} />}>
            {renderRoleRoutes()}
            <Route path="/leaderboard" element={<Home />} />
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