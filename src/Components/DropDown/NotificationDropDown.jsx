import { X } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { useEffect, useState } from "react";

const NotificationDropdown = ({ innerRef, onClose }) => {
  const { getNotifications, MarkasRead, MarkAllasRead } = useNotifications();
  const notifications =
  getNotifications.data?.pages.flatMap(page => page.data) || [];
  
  const reciverId = notifications?.[0]?.reciverId
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    const isBottom =
      scrollHeight - scrollTop <= clientHeight + 40;

    if (
      isBottom &&
      getNotifications.hasNextPage &&
      !getNotifications.isFetchingNextPage
    ) {
      getNotifications.fetchNextPage();
    }
  };



  return (
    <div
      ref={innerRef}
      className="absolute -right-10 sm:right-0 top-12 z-50 w-[340px] sm:w-[460px] bg-white border border-gray-200 rounded-2xl shadow-2xl"
    >

      <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3
                  bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
        <h2 className="text-sm font-semibold">Notifications</h2>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
          <X size={18} />
        </button>
      </div>

    
      <ul onScroll={handleScroll} className="p-3 space-y-4 max-h-[420px] overflow-y-auto">
        {notifications?.map((item) => (
          <li
            key={item?._id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 hover:bg-gray-50 transition"
          >
            <p className="text-sm text-gray-700 leading-relaxed">
              The <b>{item.assembly.assembly_name}</b> assembly encountered an issue during
              the <b>{item.process_id.process_name}</b> process, reported by
              <b> {item.senderId.full_name}</b>.
            </p>

            <p className="text-sm text-gray-800">
              <b>Title:</b> {item.title}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Description:</span>{" "}
              <span className="italic text-gray-500">
                {item.description?.length > 20
                  ? `${item.description.slice(0, 70)}...`
                  : item.description}
              </span>
            </p>

            {item?.status === "send" && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => MarkasRead.mutate(item._id)}
                  className="px-3 py-1 text-xs font-medium text-blue-600
                         border border-blue-200 rounded-md
                         hover:bg-blue-50 hover:border-blue-300"
                >
                  Mark as read
                </button>
              </div>
            )}
          </li>
        ))}


        {getNotifications.isFetchingNextPage && (
          <div className="flex justify-center items-center py-2">
            <svg
              className="w-5 h-5 text-gray-500 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
          </div>
        )}

      </ul>


      <div className="sticky bottom-0 z-20 p-3 bg-gray-50 flex justify-between items-center
                  rounded-b-2xl border-t border-gray-300">
        <button className="text-xs font-semibold text-blue-600 hover:underline">
          View All Notifications
        </button>

        <button
          onClick={() => MarkAllasRead.mutate(reciverId)}
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Mark All as Read
        </button>
      </div>
    </div>

  );
};

export default NotificationDropdown;
