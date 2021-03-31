import React, { useState } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecogintion from "./components/FaceRecogintion/FaceRecogintion";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Particles from "react-particles-js";
import { particlesOptions } from "./particles.js";

import "./App.css";

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

function App() {
  //initial state - need to check
  const [input, setInput] = useState(initialState.input);
  const [imageUrl, setImageUrl] = useState(initialState.imageUrl);
  const [box, setBox] = useState(initialState.box);
  const [route, setRoute] = useState(initialState.route);
  const [isSignedIn, setIsSignedIn] = useState(initialState.isSignedIn);
  const [user, setUser] = useState(initialState.user);

  function setInitialState() {
    setInput(initialState.input);
    setImageUrl(initialState.imageUrl);
    setBox(initialState.box);
    setRoute(initialState.route);
    setIsSignedIn(initialState.isSignedIn);
    setUser(initialState.user);
  }

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={(event) => setInput(event.target.value)}
            onPictureSubmit={onPictureSubmit}
          />
          <FaceRecogintion box={box} imageUrl={imageUrl} />
        </div>
      ) : route === "signin" || route === "signout" ? (
        <Signin onRouteChange={onRouteChange} loadUser={loadUser} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </div>
  );

  function calculateFaceLocation(data) {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  }

  function onPictureSubmit() {
    setImageUrl(input);
    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: input,
      }),
    })
      .then((response) => response.json())
      .then(
        (response) => {
          if (response) {
            fetch("http://localhost:3000/image", {
              method: "put",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: user.id,
              }),
            })
              .then((response) => response.json())
              .then((count) => {
                setUser({ ...user, entries: count });
              });
          }
          setBox(calculateFaceLocation(response));
        },
        function (err) {
          console.log(err);
        }
      );
  }

  function onRouteChange(route) {
    if (route === "signout") {
      setInitialState();
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  }

  function loadUser(data) {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  }
}

export default App;
