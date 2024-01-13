import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing  from './pages/Listing';
import Search from './pages/Search';

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<PrivateRoute/>}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/listing/:listingid' element={<Listing/>}/>
            <Route path='/create-list' element={<CreateListing/>}/>
            <Route path='/Search' element={<Search/>}/>
            <Route path='/update-listing/:id' element={<UpdateListing/>}/>
        </Route>
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
