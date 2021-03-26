import React from 'react';
//{ Component }
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import { particlesOptions } from './particles.js';
import './App.css';




function App() {
  return (
    <div className="App">
      <Particles className='particles' params={particlesOptions}/>
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      {/*<FaceRecogintion />*/}
    </div>
  );
}

export default App;
