import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Cards from '../../components/Cards';
import Wrapper from '../../components/wrapper';
import API from '../../API';

// Format Date Helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
};

// Status Badge Helper
const StatusBadge = ({ status }) => {
  let badgeColor = "bg-gray-200 text-gray-700";

  if (status === "submitted" || status === "pending") {
    badgeColor = "bg-yellow-200 text-yellow-800";
  } else if (status === "assigned") {
    badgeColor = "bg-blue-200 text-blue-800";
  } else if (status === "in_progress") {
    badgeColor = "bg-purple-200 text-purple-800";
  } else if (status === "resolved") {
    badgeColor = "bg-green-200 text-green-800";
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeColor}`}>
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
};

const StudentDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch issues
        const issuesResponse = await API.get('/api/issues/');
        console.log('Fetched issues response:', issuesResponse.data);
        if (issuesResponse.data && Array.isArray(issuesResponse.data.results)) {
          setIssues(issuesResponse.data.results);
        } else {
          console.error('Unexpected issues data structure:', issuesResponse.data);
          setIssues([]);
        }

        // Fetch statistics
        const statsResponse = await API.get('/api/issues/statistics/');
        console.log('Fetched statistics response:', statsResponse.data);
        if (statsResponse.data) {
          setStatistics(statsResponse.data);
        } else {
          console.error('Unexpected statistics data structure:', statsResponse.data);
          setStatistics(null);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const safeIssues = issues || [];

  return (
    <Wrapper>
      <div className="m-2">
        {/* Header */}
        <header className="bg-blue-950 border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Student Dashboard
              </h1>
              <p className="text-sm text-gray-300">
                Have your issues resolved
              </p>
            </div>
          </div>
        </header>

        {/* Metrics Cards */}
        <div className="mt-4 mb-4 flex flex-col gap-2 md:flex-row md:gap-4 md:justify-between">
          <Cards title="Total Issues" number={statistics ? statistics.total : 0} />
          <Cards title="Pending Issues" number={statistics ? statistics.pending : 0} />
          <Cards title="Assigned Issues" number={statistics ? statistics.assigned : 0} />
          <Cards title="In Progress" number={statistics ? statistics.in_progress : 0} />
          <Cards title="Resolved Issues" number={statistics ? statistics.resolved : 0} />
        </div>

        {/* Recent Issues Table */}
        <div className="space-y-4 mt-6">
          <h2 className="text-2xl font-bold">Recent Issues</h2>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-blue-950 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Issue ID</th>
                  <th scope="col" className="px-6 py-3">Course Code</th>
                  <th scope="col" className="px-6 py-3">Issue Type</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {safeIssues.length > 0 ? (
                  safeIssues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {issue.id}
                      </td>
                      <td className="px-6 py-4">{issue.course_code}</td>
                      <td className="px-6 py-4 capitalize">{issue.issue_type}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(issue.updated_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                      No issues found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default StudentDashboard;
