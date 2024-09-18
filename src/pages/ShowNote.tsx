import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; // Firestore imports
import { db } from "../firebaseConfig"; // Your Firebase config

// Define the type for the note details
interface TagOption {
  id: string;
  label: string;
}

interface NoteData {
  title: string;
  description: string;
  tags: TagOption[];
}

const ShowNote: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>(); // Get noteId from URL params
  const [note, setNote] = useState<(NoteData & { id: string }) | null>(null); // State to hold note details, including id
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch the note based on the document ID
  useEffect(() => {
    
    if (noteId) {
      fetchNote(noteId);
    }
  }, [noteId]);

  const fetchNote = async (noteId: string) => {
    setLoading(true); // Start loading

    try {
      const noteRef = doc(db, "notes", noteId); // Reference to the document
      const noteSnapshot = await getDoc(noteRef); // Fetch the document

      if (noteSnapshot.exists()) {
        const noteData = noteSnapshot.data() as NoteData; // Cast to your data type
        setNote({ id: noteSnapshot.id, ...noteData }); // Set the note data in state, explicitly setting id
        setError(null); // Clear any previous errors
      } else {
        setError("Note not found.");
        setNote(null);
      }
    } catch (error) {
      setError("Error fetching note.");
      console.error("Error fetching note: ", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!note) {
    return <div>No note found</div>;
  }

  return (
    <div className="min-h-screen w-screen p-6 md:p-10">
      {/* Note Title */}
      <h2 className="text-4xl font-bold text-blue-700 mb-6">{note.title}</h2>

      {/* Note Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {note.tags.map((tag) => (
          <span key={tag.id} className="bg-blue-200 text-blue-800 px-3 py-1 rounded">
            {tag.label}
          </span>
        ))}
      </div>

      {/* Note Description */}
      <p className="text-lg text-gray-700">{note.description}</p>
    </div>
  );
};

export default ShowNote;
