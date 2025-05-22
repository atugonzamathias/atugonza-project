import WrapL from "../../components/WrapL";
import { Search, CheckCircle, Clock, Users, FileText } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../API";

const Lectdash = () => {
  const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cookiesModalOpen, setCookiesModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assigned issues on mount
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await API.get("/api/issues/lecturer-issues/");
        setAllIssues(res.data);
        setFilteredIssues(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch issues.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // Filter and search
  useEffect(() => {
    let result = [...allIssues];
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }
    if (typeFilter !== "all") {
      result = result.filter((i) => i.issue_type === typeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.full_name.toLowerCase().includes(q) ||
          i.subject.toLowerCase().includes(q)
      );
    }
    setFilteredIssues(result);
  }, [statusFilter, typeFilter, searchQuery, allIssues]);

  const totalIssues = allIssues.length;
  const assignedIssues = allIssues.filter((i) => i.status === "assigned").length;
  const inProgressIssues = allIssues.filter((i) => i.status === "in_progress").length;
  const resolvedIssues = allIssues.filter((i) => i.status === "resolved").length;

  const handleReset = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setSearchQuery("");
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case "missing marks":
        return "bg-red-100 text-red-800";
      case "appeal":
        return "bg-blue-100 text-blue-800";
      case "correction":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAction = async (actionType, issueId) => {
    if (actionType !== "in_progress") return;
    try {
      const res = await API.post(`/api/issues/${issueId}/resolve/`);
      setFilteredIssues((issues) =>
        issues.map((i) => (i.id === res.data.id ? res.data : i))
      );
    } catch (err) {
      console.error("Error updating issue status:", err);
    } finally {
      setCookiesModalOpen(false);
    }
  };

  if (loading) {
    return (
      <WrapL>
        <div className="flex justify-center items-center h-screen">
          <p className="text-blue-950 text-xl font-bold">Loading issues...</p>
        </div>
      </WrapL>
    );
  }

  if (error) {
    return (
      <WrapL>
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500 text-xl font-bold">{error}</p>
        </div>
      </WrapL>
    );
  }

  return (
    <WrapL>
      <div className="p-6">
        {/* Header */}
        <header className="bg-blue-950 border-b mb-6 p-4 rounded-lg text-white">
          <h1 className="text-2xl font-bold">Lecturer Dashboard</h1>
          <p className="text-sm text-gray-300">Manage and resolve student issues</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DashboardCard title="Total Issues" value={totalIssues} subtitle="Assigned to you" icon={<FileText size={20} />} />
          <DashboardCard title="Assigned" value={assignedIssues} subtitle="Waiting" icon={<Users size={20} />} />
          <DashboardCard title="In Progress" value={inProgressIssues} subtitle="Handling" icon={<Clock size={20} />} />
          <DashboardCard title="Resolved" value={resolvedIssues} subtitle="Done" icon={<CheckCircle size={20} />} />
        </div>

        {/* Filters */}
        <div className="bg-blue-950 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 rounded"
              >
                <option value="all">All Statuses</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Issue Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full p-2 rounded"
              >
                <option value="all">All Types</option>
                <option value="missing_marks">Missing Marks</option>
                <option value="appeal">Appeal</option>
                <option value="correction">Correction</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Search</label>
              <div className="flex">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student or subject..."
                    className="w-full pl-8 p-2 rounded"
                  />
                  <Search size={16} className="absolute left-2 top-2 text-gray-400" />
                </div>
                <button onClick={handleReset} className="ml-2 px-4 py-2 rounded bg-gray-300">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-950 text-white">
              <tr>
                {["Subject", "Student", "Course", "Issue Type", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-medium uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr key={issue.id}>
                  <td className="px-4 py-2">{issue.subject}</td>
                  <td className="px-4 py-2">{issue.full_name}</td>
                  <td className="px-4 py-2">{issue.course_code}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getBadgeClass(issue.issue_type)}`}>
                      {issue.issue_type}
                    </span>
                  </td>
                  <td className="px-4 py-2 capitalize">{issue.status.replace("_", " ")}</td>
                  <td className="px-4 py-2">{new Date(issue.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => {
                        setSelectedIssue(issue);
                        setCookiesModalOpen(true);
                      }}
                      className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-blue-600"
                    >
                      Actions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {cookiesModalOpen && selectedIssue && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-lg font-semibold mb-4">Actions for: {selectedIssue.subject}</h3>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleAction("in_progress", selectedIssue.id)}
                  className="py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Mark as In Progress
                </button>
                <Link
                  to={`/resolve/${selectedIssue.id}`}
                  className="py-2 rounded bg-green-600 hover:bg-green-700 text-white text-center"
                >
                  Resolve Issue
                </Link>
                <button
                  onClick={() => setCookiesModalOpen(false)}
                  className="py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </WrapL>
  );
};

// Reusable Dashboard Card
const DashboardCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-blue-950 p-4 rounded shadow flex items-center justify-between text-white">
    <div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-2xl">{value}</p>
      <p className="text-sm text-gray-300">{subtitle}</p>
    </div>
    <div className="bg-white text-blue-950 p-2 rounded-full">{icon}</div>
  </div>
);

export default Lectdash;
