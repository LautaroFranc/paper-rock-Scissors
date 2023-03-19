import React, { useEffect, useState } from 'react';
import { Route, Routes }  from "react-router-dom"
import Home from './components/Home';
import Game from './components/menu/Game/Game';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />  
      <Route path="/Game/:roomId?" element={<Game />} />
    </Routes>
  );
}

export default App;
