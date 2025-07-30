import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { registerUser, getRolesUser, getUsersRoleJuri, registerAsjur } from '../api';

import '../css/AddUser.css';
function AddUser() {
  const [username, setUsername] = useState('');
  const [dataRole, setDataRole] = useState([]);
  const [dataJuri, setDataJuri] = useState([])
  const [juri, setJuri] = useState('')
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const fetchRole = async () => {
    const res = await getRolesUser();
    console.log('Role harusnya ini:', res.data);
    setDataRole(res.data)
  }
  const fetchJuri = async () => {
    const res = await getUsersRoleJuri();
    console.log('Juri Isinya:', res.data)
    setDataJuri(res.data);
  };

  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    if (role === 'Asjur') {
      fetchJuri();
    }
  }, [role]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      if (role !== 'Asjur') {
        alert('B aja')
        await registerUser({ username, role, password })
      }
      else {
        alert('Asjur')
        await registerAsjur({ username, role, password, juri });
      }
      navigate('/adminPage')
      // alert('User added successfully', role);
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan user');
    }
  };
  return <div className='add-user-page'>
    <form className='add-form' onSubmit={handleAddUser}>
      <h1 className='header-user'>Add User</h1>
      <div className='form-group'>
        <label htmlFor="username" className='form-label'>Username:</label>
        <input type="text" id='username' name='username' value={username || ''} onChange={(e) => { setUsername(e.target.value) }} />
      </div>
      <div className='form-group'>
        <label htmlFor="password" className='form-label'>Password:</label>
        <input type="password" id='password' name='password' value={password || ''} onChange={(e) => { setPassword(e.target.value) }} />
      </div>
      <div className='form-group decoration-black'>
        <label htmlFor="role" className='form-label'>Role:</label>
        <select
          id="role"
          name="role"
          value={role || ''}
          onChange={(e) => setRole(e.target.value)}
          className="form-select"
        >
          <option value="" disabled>Pilih Role</option>
          {dataRole
            .filter(item => item.role !== 'Admin')
            .map((item) => (
              <option key={item.id_roles} value={item.role}>
                {item.role}
              </option>
            ))}
        </select>
      </div>

      {role === 'Asjur' && (
        <div className="form-group mt-2 ">
          <label htmlFor="Juri" className="form-label">Pilih Juri Pendamping:</label>
          <select
            id="Juri"
            name="Juri"
            value={juri || ''}
            onChange={(e) => setJuri(e.target.value)}
            className="form-select"
          >
            <option value="" disabled>Pilih Juri</option>
            {dataJuri.map((j) => (
              <option key={j.id_user} value={j.username}>
                {j.username}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type='submit' className='add-user-button' >Save</button>
    </form>
  </div>;

}

export default AddUser