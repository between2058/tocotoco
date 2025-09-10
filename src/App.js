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
        <nav className="bg-gradient-to-r from-rose-400 to-lavender-400 p-4 text-white shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">💕 罵完再說 💕</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:text-sky-200 transition-colors">首頁</Link>
              <Link to="/vent" className="hover:text-sky-200 transition-colors">發洩</Link>
              <Link to="/history" className="hover:text-sky-200 transition-colors">歷史</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-6 max-w-6xl bg-white/80 backdrop-blur-sm rounded-lg shadow-xl">
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