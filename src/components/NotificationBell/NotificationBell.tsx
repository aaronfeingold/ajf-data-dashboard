"use client";
import React, { useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// TODO: REFACTOR WITH RESULTS FROM POLLING
const NotificationBell = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: "Report Complete",
      message: "Your property analysis report is ready to view",
      time: "2 minutes ago",
    },
    {
      id: 2,
      title: "Data Upload Success",
      message: "Successfully processed 150 new property records",
      time: "1 hour ago",
    },
  ]);

  return (
    <div className="absolute top-2 right-8">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="relative p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
                aria-label={`${notifications.length} notifications`}
              >
                {notifications.length}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0 bg-slate-800 border-slate-700"
          align="end"
          sideOffset={8}
        >
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-medium text-white">Notifications</h3>
          </div>
          {notifications.length > 0 ? (
            <div className="divide-y divide-slate-700 max-h-[400px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-white">
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              No new notifications
            </div>
          )}
          <div className="p-2 border-t border-slate-700 flex justify-center">
            <button
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors py-1"
              aria-label="View all notifications"
            >
              View all notifications
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationBell;
