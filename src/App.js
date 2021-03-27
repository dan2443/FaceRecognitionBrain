import React, { useState } from 'react';
//{ Component }
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecogintion from './components/FaceRecogintion/FaceRecogintion';
import Particles from 'react-particles-js';
import { particlesOptions } from './particles.js';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'e9f192e1baf346d985e03d9ba3c38fa6'
 });

function App() {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});

  function calculateFaceLocation(data){
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  function displayFaceBox(box){
    console.log(box)
    setBox(box)
  }

  function onButtonSubmit(){
    setImageUrl(input);
    app.models.predict(Clarifai.FACE_DETECT_MODEL, input).then(
    function(response) {
      displayFaceBox(calculateFaceLocation(response))
    },
    function(err) {
      console.log(err)
    }
  );
  }

  function onInputChange(event){
    setInput(event.target.value)
  }
  return (
    <div className="App">
      <Particles className='particles' params={particlesOptions}/>
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
      <FaceRecogintion box={box} imageUrl={imageUrl}/>
    </div>
  );
}

export default App;
