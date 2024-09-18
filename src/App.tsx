import { Route, Routes } from "react-router-dom";
import "./App.css";
import AddNote from "./pages/AddNote";
import ShowNotes from "./pages/ShowNotes";
import ShowNote from "./pages/ShowNote";

function App() {
  return (
    <>
      <Routes>
        <Route path="/add" element={<AddNote/>} />
        <Route path="/show/:noteId" element={<ShowNote/>} />
        <Route path="/" element={<ShowNotes/>} />

      </Routes>
    </>
  );
}

export default App;
