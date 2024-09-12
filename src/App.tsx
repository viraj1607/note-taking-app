import { Route, Routes } from "react-router-dom";
import "./App.css";
import AddNote from "./pages/AddNote";
import ShowNotes from "./pages/ShowNotes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/add" element={<AddNote/>} />
        <Route path="/" element={<ShowNotes/>} />

      </Routes>
    </>
  );
}

export default App;
