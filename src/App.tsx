import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Scenarios from './pages/Scenarios';
import Vehicles from './pages/Vehicles';
import Scenario from './pages/Scenario';
// import Bar from "../public/bars.svg";


function App() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <React.Fragment>
      <div className={`content ${isOpen ? '' : 'shifted'}`}>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-scenario" element={<Scenario />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/vehicles" element={<Vehicles />} />
        </Routes>
      </div>
    </React.Fragment>
  );
}

export default App;
