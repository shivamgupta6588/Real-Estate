import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Profile from './pages/profile';
import About from './pages/about';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
