import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../pages/notifications";
import "./NotificationBell.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response.data.results || []); // ✅ Only store the array
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };
    fetchNotifications();
  }, []);

  const handleBellClick = () => {
    setOpen((prev) => !prev);
  };

  const handleViewAll = () => {
    navigate("/notifications");
  };

  return (
    <div className="relative">
      <button onClick={handleBellClick} className="relative">
        <Bell size={24} />
        {notifications.length > 0 && (
          <span className="notification-badge">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded p-2 z-50 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            <>
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="border-b py-1 text-sm">
                  {notification.message}
                </div>
              ))}
              <div className="pt-2 text-right">
                <button
                  onClick={handleViewAll}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View All Notifications
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
