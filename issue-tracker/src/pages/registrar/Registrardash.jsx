import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react'; // You were missing this import for the User icon
import API from '../../API';
import LogoutButton from '../../components/LogoutButton';
import Cards from '../../components/Cards';

const RegistrarDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    assigned: 0,
    in_progress: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await API.get('/api/issues/');
      console.log('Fetched issues response:', response.data);

      let fetchedIssues = [];

      if (Array.isArray(response.data)) {
        fetchedIssues = response.data;
      } else if (Array.isArray(response.data.results)) {
        fetchedIssues = response.data.results;
      } else if (Array.isArray(response.data.data)) {
        fetchedIssues = response.data.data;
      } else if (Array.isArray(response.data.issues)) {
        fetchedIssues = response.data.issues;
      } else {
        console.error('Unexpected data format, wrapping in array:', response.data);
        fetchedIssues = [response.data];
      }

      setIssues(fetchedIssues);
      setFilteredIssues(fetchedIssues);
      updateStats(fetchedIssues);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    }
  };

  const updateStats = (issuesList) => {
    const total = issuesList.length;
    const submitted = issuesList.filter(issue => issue.status === 'submitted').length;
    const assigned = issuesList.filter(issue => issue.status === 'assigned').length;
    const in_progress = issuesList.filter(issue => issue.status === 'in_progress').length;
    const resolved = issuesList.filter(issue => issue.status === 'resolved').length;

    setStats({ total, submitted, assigned, in_progress, resolved });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);

    if (status === 'All') {
      setFilteredIssues(issues);
    } else {
      const filtered = issues.filter(issue => issue.status === status);
      setFilteredIssues(filtered);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <LogoutButton />
        <Link to="/profile">
          <button className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full">
            <User size={24} className="text-white" />
          </button>
        </Link>
      </div>

      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Registrar Dashboard</h1>
        <p className="text-gray-600">Manage and assign academic issues.</p>
      </div>

      {/* Key Metrics (using Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Cards title="Total Issues" number={stats.total} />
        <Cards title="Submitted" number={stats.submitted} />
        <Cards title="Assigned" number={stats.assigned} />
        <Cards title="Resolved" number={stats.resolved} />
      </div>

      {/* Status Filter */}
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="All">All</option>
          <option value="submitted">Submitted</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Issues Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Issue ID</th>
              <th className="py-3 px-4 text-left">Student</th>
              <th className="py-3 px-4 text-left">Course Code</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Date Submitted</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="border-t">
                <td className="py-3 px-4">{issue.id}</td>
                <td className="py-3 px-4">{issue.full_name}</td>
                <td className="py-3 px-4">{issue.course_code}</td>
                <td className="py-3 px-4 capitalize">{issue.status.replace('_', ' ')}</td>
                <td className="py-3 px-4">{new Date(issue.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-center">
                  <Link to={`/assign/${issue.id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
                      Assign
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No issues found */}
        {filteredIssues.length === 0 && (
          <div className="text-center p-6 text-gray-500">
            No issues found for selected status.
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrarDashboard;
