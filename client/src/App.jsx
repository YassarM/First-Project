import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import Axios from 'axios';
import Navbar from './Component/Navbar';
import HomePage from './pages/HomePage';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const RekapNilai = lazy(() => import('./pages/RekapNilai'));
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


function App() {
  const [UsernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState(null);

  const [loginStatus, setLoginStatus] = useState(null);

  Axios.defaults.withCredentials = true

  useEffect(() => {
    Axios.get("http://localhost:5000/login").then((res) => {
      setLoginStatus(res.data.LoggedIn);
      if (res.data.LoggedIn) {
        setUsername(res.data.user.username);
        setRole(res.data.user.role);
      }
    })
  }, [])

  return (
    <>
      <Navbar setLoginStatus={loginStatus} Admin={role} />
    <h1>{username}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login setUsername={setUsername} setRole={setRole} setLoginStatus={setLoginStatus} />} />
          <Route path="/register" element={<SignIn setUsername={setUsername} setRole={setRole} setLoginStatus={setLoginStatus} />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/moreInfo" element={<MoreInfo />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rekapNilai" element={
            <ProtectedRoute allowedRoles={['panitia', 'pelatih', 'peserta', 'Guest', 'Admin']} userRole={role}>
              <RekapNilai />
            </ProtectedRoute>
          } />
            <Route path="/rn" element={<AddRekapNilai />} />
          <Route path="/logout" element={
            <Logout setRole={setRole} setUsername={setUsername} setLoggedInStatus={setLoginStatus} />
          } />
          <Route path="/control" element={
            <ProtectedRoute allowedRoles={['Admin']} userRole={role}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/editUser/:id" element={<EditUser />} />
          <Route path="/addUser" element={<AddUser />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App