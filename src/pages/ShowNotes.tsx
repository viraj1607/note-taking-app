import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreatableSelect, { MultiValue } from "react-select";
import { collection, getDocs } from "firebase/firestore"; // Firestore imports
import { db } from "../firebaseConfig";

// Define the types for tags and notes
interface TagOption {
  value: string;
  id: string;
  label: string;
}

interface NoteData {
  id: string;
  title: string;
  description: string;
  tags: TagOption[];
}

const ShowNotes: React.FC = () => {
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<MultiValue<TagOption>>([]);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [availableTags, setAvailableTags] = useState<TagOption[]>([]); // Store fetched tags
  const [filteredNotes, setFilteredNotes] = useState<NoteData[]>([]); // Filtered notes

  // Fetch notes and tags from Firestore on component mount
  useEffect(() => {
    const fetchNotesAndTags = async () => {
      try {
        // Fetch notes
        const notesSnapshot = await getDocs(collection(db, "notes"));
        const notesData: NoteData[] = notesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as NoteData[];

        setNotes(notesData);

        // Fetch tags
        const tagsSnapshot = await getDocs(collection(db, "tags")); // Assuming you have a 'tags' collection
        const tagsData: TagOption[] = tagsSnapshot.docs.map((doc) => ({
          id: doc.id,
          value: doc.id,
          label: doc.data().label,
        }));

        setAvailableTags(tagsData); // Set available tags in the dropdown
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchNotesAndTags();
  }, []);

  // Function to filter notes based on title and tags
  const filterNotes = () => {
    let filtered = notes;

    // Filter by title
    if (searchTitle.trim() !== "") {
      filtered = filtered.filter((note) =>
        note.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) =>
        selectedTags.every((selectedTag) =>
          note.tags.some((noteTag) => noteTag.id === selectedTag.id)
        )
      );
    }

    setFilteredNotes(filtered); // Set filtered notes
  };

  // Re-filter notes whenever searchTitle, selectedTags, or notes change
  useEffect(() => {
    filterNotes();
  }, [searchTitle, selectedTags, notes]);

  return (
    <div className="min-h-screen w-screen p-6 md:p-10">
      {/* Header: Notes on the left, Create Note button on the right */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-blue-700">Notes</h2>
        <Link to="/add">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
            Create Note
          </button>
        </Link>
      </div>

      {/* Search Section: Input field and Tags Dropdown */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 w-full">
        {/* Search by Title */}
        <div className="w-full md:w-1/2">
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
            placeholder="Search by title"
          />
        </div>

        <div className="w-full md:w-1/2">
          {/* Search by Tags */}
          <CreatableSelect
            isMulti
            value={selectedTags}
            onChange={(newTags) => setSelectedTags(newTags)}
            options={availableTags} // Set fetched tags as options in the dropdown
            placeholder="Search by tags"
            classNamePrefix="select"
            styles={{
              control: (base) => ({
                ...base,
                padding: "0.5rem",
                borderRadius: "0.5rem",
                borderColor: "#cbd5e1",
                "&:hover": { borderColor: "#60a5fa" },
                boxShadow: "none",
              }),
            }}
          />
        </div>
      </div>

      {/* Notes List with Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-white rounded-lg shadow-lg border border-gray-300"
          >
            <h3 className="text-2xl font-semibold mb-2">{note.title}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {note.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-blue-200 text-blue-800 px-2 py-1 rounded"
                >
                  {tag.label}
                </span>
              ))}
            </div>
            <p className="text-gray-700">
              {note.description.substring(0, 50)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowNotes;
