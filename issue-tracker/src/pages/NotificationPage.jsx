import React, { useEffect, useState } from "react";
import { getNotifications } from "./notifications";
import BackArrow from "../components/BackArrow"; // Adjust the path as necessary

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response.data.results || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <BackArrow />
        </div>

        <h1 className="text-2xl font-bold text-center text-blue-950 mb-6">
          Notifications
        </h1>

        {notifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition"
              >
                <p className="text-gray-800">{notification.message}</p>
                <span className="block mt-2 text-sm text-gray-500">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
