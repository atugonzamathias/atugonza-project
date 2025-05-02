import React from "react";
import API from "../API";

export const getNotifications = async () => {
  return await API.get('/api/notifications/');
};
export const markAsRead = async (id) => {
  return await API.patch(`/api/notifications/${id}/`, { read: true });
};
