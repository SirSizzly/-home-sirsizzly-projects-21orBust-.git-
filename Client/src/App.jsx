// Client/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import DemoStartScreen from "./demo/screens/DemoStartScreen.jsx";
import DemoGameplayScreen from "./demo/screens/DemoGameplayScreen.jsx";
import DemoShopScreen from "./demo/screens/DemoShopScreen.jsx";

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
            <Route path="/demo/start" element={<DemoStartScreen />} />
            <Route path="/demo/game" element={<DemoGameplayScreen />} />
            <Route path="/demo/shop" element={<DemoShopScreen />} />

            {/* DEFAULT → redirect to demo start */}
            <Route path="*" element={<DemoStartScreen />} />
          </Routes>
        </main>

        <footer className="app-footer">
          Demo Build • Gothic Arcana Edition
        </footer>
      </div>
    </BrowserRouter>
  );
}
