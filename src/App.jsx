import { useState, createContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import SignupForm from './components/SignupForm/SignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import * as authService from '../src/services/authService'; // import the authservice
import HootList from './components/HootList/HootList';
import * as hootService from './services/hootService';
import HootDetails from './components/HootDetails/HootDetails';
import HootForm from './components/HootForm/HootForm';
import { Link } from 'react-router-dom';


export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser()); // using the method from authservice
  const [hoots, setHoots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();
  
      setHoots(hootsData);
    };
    
    if (user) fetchAllHoots();
  }, [user]);

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };
  
  const handleAddHoot = async (hootFormData) => {
    const newHoot = await hootService.create(hootFormData);
    setHoots([newHoot, ...hoots]);
    navigate('/hoots');
  };

  const handleDeleteHoot = async (hootId) => {
    console.log('hootId', hootId);
    const deletedHoot = await hootService.deleteHoot(hootId);
    setHoots(hoots.filter((hoot) => hoot._id !== deletedHoot._id));
    navigate('/hoots');
  };
  
  const handleUpdateHoot = async (hootId, hootFormData) => {
    const updatedHoot = await hootService.update(hootId, hootFormData);
    // console.log('hootId:', hootId, 'hootFormData:', hootFormData);
    setHoots(hoots.map((hoot) => (hootId === hoot._id ? updatedHoot : hoot)));
    navigate(`/hoots/${hootId}`);
  };
  

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />

        <Routes>
  {user ? (
    // Protected Routes:
    <>
      <Route path="/" element={<Dashboard user={user} />} />
      <Route path="/hoots" element={<HootList hoots={hoots} />} />
      <Route path="/hoots/new" element={<HootForm handleAddHoot={handleAddHoot} />} />
      <Route path="/hoots/:hootId" element={<HootDetails handleDeleteHoot={handleDeleteHoot} />} />
      <Route path="/hoots/:hootId/edit" element={<HootForm handleUpdateHoot={handleUpdateHoot} />} />
    </>
    
  ) : (
    // Public Route:
    <Route path="/" element={<Landing />} />
  )}
  <Route path="/signup" element={<SignupForm setUser={setUser} />} />
  <Route path="/signin" element={<SigninForm setUser={setUser} />} />
</Routes>

      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
