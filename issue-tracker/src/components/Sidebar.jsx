import React from "react";
import { Link } from "react-router";
import LogoutButton from "./LogoutButton";
import { User } from 'lucide-react';
import NotificationBell from "./NotificationBell";

const Sidebar = () => {
  return (
    <div>
      <aside
        id="sidebar-multi-level-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-blue-950">
          <ul class="space-y-2 font-medium">
            <li>
              <Link
                to="/studdash"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                >
                  <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
                </svg>
                <span class="ms-3">Student Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to="/submission"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                >
                  <path d="M120-200v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Z" />
                </svg>{" "}
                <span class="flex-1 ms-3 whitespace-nowrap">Create Issue</span>
              </Link>
            </li>

            <li>
              <Link to="/profile">
                <button className="p-2">
                  <span className="sr-only">Profile</span>
                  <User size={24} className="text-white" />
                </button>
              </Link>
            </li>
            <LogoutButton />
          </ul>
          <NotificationBell />
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
