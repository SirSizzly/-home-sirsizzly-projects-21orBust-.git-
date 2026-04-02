// Client/src/App.jsx
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import GameplayScreen from './screens/GameplayScreen.jsx';
import StartScreen from './screens/StartScreen.jsx';
import ShopScreen from './screens/ShopScreen.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <header className="app-header">
          <h1>21orBust — Demo Mode</h1>
        </header>

        <main className="app-content">
          <Routes>
            {/* DEMO ROUTES */}
            <Route path="/start" element={<StartScreen />} />
            <Route path="/game" element={<GameplayScreen />} />
            <Route path="/shop" element={<ShopScreen />} />

            {/* DEFAULT → redirect to demo start */}
            <Route path="*" element={<StartScreen />} />
          </Routes>
        </main>

        <footer className="app-footer">
          Demo Build • Gothic Arcana Edition
        </footer>
      </div>
    </BrowserRouter>
  );
}
