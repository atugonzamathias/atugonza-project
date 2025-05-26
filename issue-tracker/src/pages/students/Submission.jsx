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

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
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
      alert("Failed to submit issue: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
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
            {/* Auto-filled User Info */}
            {["user_number", "registration_number", "full_name"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block mb-1 text-sm font-medium text-gray-700">
                  {field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field]}
                  className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5"
                  disabled
                />
              </div>
            ))}

            {/* Text Inputs */}
            {[
              { label: "Course Unit", id: "subject" },
              { label: "Course Code", id: "course_code" },
              { label: "Course ID", id: "course_id" },
              { label: "Lecturer Name", id: "lecturer_name" },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block mb-1 text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
            ))}

            {/* Category Dropdown */}
            <div>
              <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5"
                required
              >
                <option value="">Select category</option>
                <option value="test">Test</option>
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="overall_coursework">Overall Coursework</option>
                <option value="final_exam">Final Exam</option>
              </select>
            </div>

            {/* Year of Study */}
            <div>
              <label htmlFor="year_of_study" className="block mb-1 text-sm font-medium text-gray-700">
                Year of Study
              </label>
              <select
                id="year_of_study"
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5"
                required
              >
                <option value="">Select year</option>
                {[1, 2, 3, 4, 5, 6].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label htmlFor="semester" className="block mb-1 text-sm font-medium text-gray-700">
                Semester
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5"
                required
              >
                <option value="">Select semester</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>

            {/* Issue Type */}
            <div>
              <label htmlFor="issue_type" className="block mb-1 text-sm font-medium text-gray-700">
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
              <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
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

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
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
