import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { MultiValue } from "react-select";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

// Define the type for tags
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

const Form: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<MultiValue<TagOption>>([]);
  const [description, setDescription] = useState<string>("");
  const [formDataArr, setFormDataArr] = useState<NoteData[]>([]);

  const handleSave = () => {
    // Add save logic here
    console.log({ title, tags, description });
    const tagIds = tags.map((tag) => tag.id);
    const newEntry: NoteData = { title, tagIds: tagIds, description };
    const updatedArray = [...formDataArr, newEntry];

    setFormDataArr(updatedArray);
    localStorage.setItem("NoteData", JSON.stringify(updatedArray));
    localStorage.setItem("Tags",JSON.stringify(tags))
    console.log(updatedArray);
    alert("Data saved successfully!");

    // Clear form fields after saving
    setTitle("");
    setTags([]);
    setDescription("");
  };

  const handleCancel = () => {
    // Clear form fields
    setTitle("");
    setTags([]);
    setDescription("");
  };

  const handleCreateTag = (inputValue: string) => {
    // Create a new tag with a unique ID using uuidv4
    console.log(tags);
    const newTag: TagOption = {
      value: inputValue,
      id: uuidv4(),
      label: inputValue,
    };
    setTags((prevTags) => [...prevTags, newTag]);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 md:p-10">
      <h2 className="text-4xl font-bold mb-8 text-blue-700 text-center md:text-left">
        Create New Note
      </h2>

      {/* Title and Tags side by side */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Title Input */}
        <div className="flex-1">
          <label className="block text-gray-800 font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300 ease-in-out bg-white shadow-md"
            placeholder="Enter title"
          />
        </div>

        {/* Tags Dropdown with CreatableSelect */}
        <div className="flex-1">
          <label className="block text-gray-800 font-medium mb-2">Tags</label>
          <CreatableSelect
            isMulti
            value={tags}
            onChange={(newValue) => setTags(newValue)}
            onCreateOption={handleCreateTag}
            placeholder="Select or create tags"
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

      {/* Description Text Area */}
      <div className="mb-8">
        <label className="block text-gray-800 font-medium mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-72 p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300 ease-in-out bg-white shadow-md"
          placeholder="Enter description"
        />
      </div>

      {/* Save and Cancel Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleSave}
          className="w-full md:w-auto px-8 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none transition transform hover:scale-105"
        >
          Save
        </button>
        <Link to="/">
          <button
            onClick={handleCancel}
            className="w-full md:w-auto px-8 py-4 bg-gray-300 text-gray-700 rounded-lg shadow-lg hover:bg-gray-400 focus:ring-4 focus:ring-gray-200 focus:outline-none transition transform hover:scale-105"
          >
            Cancel
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Form;
