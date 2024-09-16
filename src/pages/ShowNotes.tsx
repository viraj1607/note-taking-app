import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreatableSelect, { MultiValue } from "react-select";

// Define the types for tags and notes
interface TagOption {
  value: string;
  id: string;
  label: string;
}

interface NoteData {
  title: string;
  description: string;
  tagIds: string[];
}

const ShowNotes: React.FC = () => {
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<MultiValue<TagOption>>([]);
  const [notes, setNotes] = useState<NoteData[]>([]);

  // Fetch notes from localStorage
  useEffect(() => {
    const storedNotes = localStorage.getItem("NoteData");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  // Handle search by title
  const handleSearchTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value);
  };

  // Filter notes based on search title and selected tags
  const filteredNotes = notes.filter((note) => {
    const matchesTitle = note.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => note.tagIds.includes(tag.id));

    return matchesTitle && matchesTags;
  });

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
        {/* Common width for both inputs */}
        <div className="w-full md:w-1/2">
          {/* Search by Title */}
          <input
            type="text"
            value={searchTitle}
            onChange={handleSearchTitle}
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
        {filteredNotes.map((note, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-lg border border-gray-300"
          >
            <h3 className="text-2xl font-semibold mb-2">{note.title}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {/* Display tags */}
              {note.tagIds.map((tagId) => {
                const tag = selectedTags.find((tag) => tag.id === tagId);
                return (
                  tag && (
                    <span
                      key={tag.id}
                      className="bg-blue-200 text-blue-800 px-2 py-1 rounded"
                    >
                      {tag.label}
                    </span>
                  )
                );
              })}
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
