import { Routes, Route } from "react-router-dom";
import GamesDashboard from "./gameDashboard";
import GameDetail from "./GameDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GamesDashboard />} />
      <Route path="/game/:id" element={<GameDetail />} />
    </Routes>
  );
}