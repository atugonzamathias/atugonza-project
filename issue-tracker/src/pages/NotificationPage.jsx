import React from "react";
import { useEffect, useState } from "react";
import { getNotifications } from "./notifications";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await getNotifications();
      setNotifications(response.data); 
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id} className="border-b py-2">
            <p>{notification.message}</p>
            <span className="text-sm text-gray-500">{notification.timestamp}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
