import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackArrow from '../../components/BackArrow';
import API from "../../API"; 

const Assign = ({ name }) => {
  const { id } = useParams();  // Issue ID from URL params

  const [formData, setFormData] = useState({
    lecturer: '',  // Store the selected lecturer ID
    notes: '',      // Store additional notes
  });

  const [lecturers, setLecturers] = useState([]);  // Store list of lecturers
  const [message, setMessage] = useState("");  // Store success or error message
  const [messageType, setMessageType] = useState("");  // Store message type (success or error)
  const [issueDetails, setIssueDetails] = useState(null); // Store issue details

  useEffect(() => {
    // Fetch lecturers when component loads
    const fetchLecturers = async () => {
      try {
        const response = await API.get("/api/users/lecturers/");
        setLecturers(response.data); // Assuming response is a list of lecturers
      } catch (error) {
        console.error("Failed to fetch lecturers", error);
      }
    };

    // Fetch issue details based on ID from URL
    const fetchIssueDetails = async () => {
      try {
        const response = await API.get(`/api/issues/${id}/`);
        setIssueDetails(response.data); // Assuming response is the issue details
      } catch (error) {
        console.error("Failed to fetch issue details", error);
      }
    };

    fetchLecturers();
    fetchIssueDetails();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior

    if (!formData.lecturer) {
      setMessage("Please select a lecturer.");
      setMessageType("error");
      return;  // Don't submit if no lecturer is selected
    }

    try {
      console.log("Form Data being sent:", formData);  // Log form data for debugging
      const response = await API.post(`/api/issues/${id}/assign/`, {
        assigned_to: formData.lecturer,  // Send the lecturer's ID as "assigned_to"
        notes: formData.notes,
      });
      console.log("Issue assigned successfully!", response.data);
      
      // Set success message
      setMessage("Issue assigned successfully!");
      setMessageType("success");
    } catch (err) {
      console.error("Error while assigning the issue:", err.response ? err.response.data : err);
      
      // Set error message
      setMessage("Failed to assign the issue. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="m-2">
      <BackArrow />
      {/* Header */}
      <div className="m-2">
        <header className="bg-blue-950 border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              Assign Issue to Lecturer
            </h1>
            <p className="text-sm text-gray-300">
              Select a Lecturer to handle this and they will be notified.
            </p>
          </div>
        </header>
      </div>

      {/* Issue Details */}
      {issueDetails && (
        <div className="space-y-4">
          <p className="text-2xl font-bold text-gray-600">Issue Details</p>
          <div className="mt-4 mb-4 flex flex-col gap-2 md:flex-row md:justify-between">
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-blue-950 dark:border-gray-700 dark:hover:bg-gray-700">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                Student: {issueDetails.full_name}
              </h5>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                Subject: {issueDetails.subject}
              </h5>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                Type: {issueDetails.issue_type}
              </h5>
            </div>
          </div>
        </div>
      )}

      {/* Success or Error Message */}
      {message && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      {/* Assign Form */}
      <div className="space-y-4 mb-4">
        <form>
          <div className="mb-5">
            <label
              htmlFor="lecturer"
              className="block mb-2 text-sm text-left font-medium text-gray-600"
            >
              Assign to lecturer
            </label>
            <select
              id="lecturer"
              name="lecturer"
              value={formData.lecturer}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="">Select a lecturer</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.full_name || lecturer.username}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label
              htmlFor="notes"
              className="block mb-2 text-sm text-left font-medium text-gray-600"
            >
              Assignment Details (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={formData.notes}
              placeholder="Add any specifications to the lecturer here"
              onChange={handleChange}
              rows={5}
            />
          </div>
        </form>
      </div>

      {/* Buttons */}
      <div className="text-sm mb-5 flex items-end flex-wrap">
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-blue-950 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Assign to lecturer
          </button>

          <button
            type="button"
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-blue-950 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Mark as resolved
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assign;
