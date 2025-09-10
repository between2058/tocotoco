import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
/* No App.css needed, using Tailwind */
import Home from './components/Home';
import Vent from './components/Vent';
import Preview from './components/Preview';
import History from './components/History';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="bg-blue-600 p-4 text-white">
          <div className="container mx-auto flex justify-between">
            <h1 className="text-xl font-bold">罵完再說</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">首頁</Link>
              <Link to="/vent" className="hover:underline">發洩</Link>
              <Link to="/history" className="hover:underline">歷史</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vent" element={<Vent />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;