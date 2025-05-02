import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../API";
import Wrapper from '../../components/wrapper';

const Submission = () => {
  const [formData, setFormData] = useState({
    user_number: "",
    registration_number: "",
    full_name: "",
    subject: "",
    course_code: "",
    course_id: "",
    issue_type: "",
    category: "",
    description: "",
    year_of_study: "",
    semester: "",
    lecturer_name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // <-- Added

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.get("/api/auth/details/");
        const data = response.data;
        setFormData((prevData) => ({
          ...prevData,
          user_number: data.user_number,
          registration_number: data.registration_number,
          full_name: data.full_name,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // <-- Start submitting
    try {
      const response = await API.post("/api/issues/", formData);
      console.log("Issue submitted successfully:", response.data);
      alert("Issue submitted successfully!");

      setFormData((prevData) => ({
        user_number: prevData.user_number,
        registration_number: prevData.registration_number,
        full_name: prevData.full_name,
        subject: "",
        course_code: "",
        course_id: "",
        issue_type: "",
        category: "",
        description: "",
        year_of_study: "",
        semester: "",
        lecturer_name: "",
      }));
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert(
        "Failed to submit issue: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false); // <-- Stop submitting
    }
  };

  return (
    <Wrapper>
      <div className="flex justify-center items-center bg-gray-100 min-h-screen p-4">
        <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl">
          <h2 className="text-center mb-6 text-2xl font-bold text-blue-600">
            Submit an Issue
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Info (auto-filled) */}
            {[
              { label: "User Number", id: "user_number" },
              { label: "Registration Number", id: "registration_number" },
              { label: "Full Name", id: "full_name" },
            ].map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5"
                  disabled
                />
              </div>
            ))}

            {/* Other Fields */}
            {[
              { label: "Subject", id: "subject", placeholder: "Enter subject" },
              { label: "Course Code", id: "course_code", placeholder: "Enter course code" },
              { label: "Course ID", id: "course_id", placeholder: "Enter course ID" },
              { label: "Category", id: "category", placeholder: "Enter issue category" },
              { label: "Year of Study", id: "year_of_study", placeholder: "Enter year of study" },
              { label: "Semester", id: "semester", placeholder: "Enter semester" },
              { label: "Lecturer Name", id: "lecturer_name", placeholder: "Enter lecturer's name" },
            ].map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
            ))}

            {/* Issue Type */}
            <div>
              <label
                htmlFor="issue_type"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Issue Type
              </label>
              <select
                id="issue_type"
                name="issue_type"
                value={formData.issue_type}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5"
                required
              >
                <option value="">Select relevant option</option>
                <option value="missing_marks">Missing Marks</option>
                <option value="appeal">Appeal</option>
                <option value="correction">Correction</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Issue Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your issue"
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5"
                rows="5"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting} // <-- disable when submitting
                className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Issue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default Submission;
