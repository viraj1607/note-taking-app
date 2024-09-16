import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { MultiValue } from "react-select";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Define the type for tags
interface TagOption {
  value: string;
  id: string;
  label: string;
}

// interface NoteData {
//   title: string;
//   description: string;
//   tagIds: string[];
// }

const Form: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<MultiValue<TagOption>>([]);
  const [description, setDescription] = useState<string>("");
  // const [formDataArr, setFormDataArr] = useState<NoteData[]>([]);
  const [availableTags, setAvailableTags] = useState<TagOption[]>([]); // State for storing fetched tags

  // Fetch tags from Firestore when the component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tags"));
        const tagsData: TagOption[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          value: doc.data().label,
          label: doc.data().label,
        }));
        setAvailableTags(tagsData);
      } catch (error) {
        console.error("Error fetching tags: ", error);
      }
    };

    fetchTags();
  }, []);

  const handleSave = async () => {
    const simplifiedTags = tags.map((tag) => ({
      id: tag.id,
      label: tag.label,
    }));

    const newEntry = {
      title,
      tags: simplifiedTags,
      description,
    };

    try {
      // Save the note to Firestore
      await addDoc(collection(db, "notes"), newEntry);
      // await addDoc(collection(db, "tags"), tags);
      alert("Data saved successfully to Firestore!");

      // Clear form fields after saving
      setTitle("");
      setTags([]);
      setDescription("");
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save data to Firestore.");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setTags([]);
    setDescription("");
  };

  const handleCreateTag = async (inputValue: string) => {
    const newTag: TagOption = {
      value: inputValue,
      id: uuidv4(),
      label: inputValue,
    };

    try {
      // Save the new tag to Firestore
      await addDoc(collection(db, "tags"), { label: inputValue });
      // Add the new tag to the dropdown options
      setAvailableTags((prevTags) => [...prevTags, newTag]);
      setTags((prevTags) => [...prevTags, newTag]);
    } catch (error) {
      console.error("Error adding new tag: ", error);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 md:p-10">
      <h2 className="text-4xl font-bold mb-8 text-blue-700 text-center md:text-left">
        Create New Note
      </h2>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
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
            options={availableTags} // Use available tags as options
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

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleSave}
          className="w-full md:w-auto px-8 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none transition transform hover:scale-105"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="w-full md:w-auto px-8 py-4 bg-gray-300 text-gray-700 rounded-lg shadow-lg hover:bg-gray-400 focus:ring-4 focus:ring-gray-200 focus:outline-none transition transform hover:scale-105"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Form;
