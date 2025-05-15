import React, { useEffect, useState } from "react";
import { getNotifications } from "./notifications";
import BackArrow from "../components/BackArrow"; // Adjust the import path as necessary

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response.data.results || []); // ✅ Only set the array
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <BackArrow />
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id} className="border-b py-2">
            <p>{notification.message}</p>
            <span className="text-sm text-gray-500">
              {new Date(notification.created_at).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
