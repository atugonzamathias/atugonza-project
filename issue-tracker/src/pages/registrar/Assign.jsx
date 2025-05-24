import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackArrow from "../../components/BackArrow";
import API from "../../API";

const Assign = ({ name }) => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    lecturer: "",
    notes: "",
  });

  const [lecturers, setLecturers] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [issueDetails, setIssueDetails] = useState(null);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const response = await API.get("/api/users/lecturers/");
        setLecturers(response.data);
      } catch (error) {
        console.error("Failed to fetch lecturers", error);
      }
    };

    const fetchIssueDetails = async () => {
      try {
        const response = await API.get(`/api/issues/${id}/`);
        setIssueDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch issue details", error);
      }
    };

    fetchLecturers();
    fetchIssueDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.lecturer) {
      setMessage("Please select a lecturer.");
      setMessageType("error");
      return;
    }

    try {
      const response = await API.post(`/api/issues/${id}/assign/`, {
        assigned_to: formData.lecturer,
        notes: formData.notes,
      });

      setMessage("Issue assigned successfully!");
      setMessageType("success");
    } catch (error) {
        if (error.response) {
          console.error("Error while assigning the issue:", error.response.data);
        } else {
          console.error("Error while assigning the issue:", error.message);
        }
}
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl">
        <BackArrow />

        {/* Header */}
        <div className="mb-4">
          <header className="bg-blue-950 border-b border-gray-200 px-6 py-4 rounded-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <h1 className="text-2xl font-bold text-white">
                Assign Issue to Lecturer
              </h1>
              <p className="text-sm text-gray-300 mt-2 md:mt-0">
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
              <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-blue-950 dark:border-gray-700 dark:hover:bg-gray-700 w-full">
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
                className="block mb-2 text-sm font-medium text-gray-600"
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
                className="block mb-2 text-sm font-medium text-gray-600"
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
        <div className="text-sm mb-5 flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={handleSubmit}
            className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-blue-950 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Assign to lecturer
          </button>

          <button
            type="button"
            className="py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-blue-950 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Mark as resolved
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assign;
