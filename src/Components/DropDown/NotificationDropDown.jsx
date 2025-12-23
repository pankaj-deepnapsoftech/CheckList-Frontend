import { X } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { useEffect, useState } from "react";

const NotificationDropdown = ({ innerRef, onClose }) => {
  const { getNotifications, MarkasRead, MarkAllasRead } = useNotifications();
  const reciverId = getNotifications?.data?.map((i) => i?.reciverId)
  

  return (
    <div
      ref={innerRef}
      className="absolute -right-10 sm:right-0 top-12 z-50 w-[340px] sm:w-[460px] max-h-[520px] overflow-auto bg-white border border-gray-200 rounded-2xl shadow-2xl"
    >

      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
        <h2 className="text-sm font-semibold">Notifications</h2>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
          <X size={18} />
        </button>
      </div>

      <ul className="p-3 space-y-4">
        {getNotifications?.data?.map((item) => (
          <li  key={item?._id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 hover:bg-gray-50 transition">
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
              <span className="italic text-gray-500 ">
                {item.description?.length > 20
                  ? `${item.description.slice(0, 70)}...`
                  : item.description}
              </span>
            </p>


            {item?.status === "send" && <div className="pt-2 flex justify-end">
              <button
                onClick={() => MarkasRead.mutate(item._id)}
                className="px-3 py-1 text-xs font-medium text-blue-600 
               border border-blue-200 rounded-md
               hover:bg-blue-50 hover:border-blue-300
               focus:outline-none "
              >
                Mark as read
              </button>
            </div>
            }

          </li>

        ))}
      </ul>



      <div className="p-3 bg-gray-50 flex justify-between items-center rounded-b-2xl border-t border-gray-300">
        <button
          // onClick={handleViewAll}
          className="text-xs font-semibold text-blue-600 hover:underline focus:outline-none"
        >
          View All Notifications
        </button>

        <button
          onClick={() => MarkAllasRead.mutate(reciverId[0])}
          className="text-xs font-semibold text-blue-600 hover:underline focus:outline-none"
        >
          Mark All as Read
        </button>
      </div>

    </div>
  );
};

export default NotificationDropdown;
