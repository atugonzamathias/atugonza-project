import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackArrow from '../../components/BackArrow';
import API from "../../API"; // Adjust the path if needed

const ResolveIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [issueDetails, setIssueDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        const res = await API.get(`/api/issues/${id}/`);
        setIssueDetails(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load issue details.");
      }
    };
    fetchIssueDetails();
  }, [id]);

  const handleResolve = () => {
    if (!notes.trim()) {
      setError("Please enter resolution notes before submitting.");
      return;
    }

    setLoading(true);
    API.post(`/api/issues/${id}/resolve/`, { resolution_notes: notes })
      .then(() => {
        navigate("/lectdash");
      })
      .catch(() => setError("Could not resolve issue. Please try again."))
      .finally(() => setLoading(false));
  };

  if (!issueDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-blue-950 text-xl font-bold">Loading issue details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <BackArrow />
      <h2 className="text-2xl font-semibold mb-4">
        Resolve Issue: {`Issue #${id}`}
      </h2>

      <p><strong>Subject:</strong> {issueDetails.subject}</p>
      <p><strong>Course Code:</strong> {issueDetails.course_code}</p>
      <p><strong>Course ID:</strong> {issueDetails.course_id}</p>
      <p><strong>Student Name:</strong> {issueDetails.full_name}</p>
      <p><strong>Registration Number:</strong> {issueDetails.registration_number}</p>
      <p><strong>Lecturer:</strong> {issueDetails.lecturer_name}</p>

      <label className="block mt-4 mb-2 font-medium">Resolution Notes</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={5}
        className="w-full p-2 border rounded mb-4"
        placeholder="Describe how you’ve addressed the issue…"
      />

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="flex space-x-2">
        <button
          onClick={handleResolve}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={loading || !notes.trim()}
        >
          {loading ? 'Resolving...' : 'Mark as Resolved'}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ResolveIssue;
