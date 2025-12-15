import { X } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "You have a new message from Yin",
    description: "Hello there, check this new items you may be interested in.",
    time: "10 minutes ago",
  },
  {
    id: 2,
    title: "You have a new message from Haper",
    description: "Hello there, check this new items you may be interested in.",
    time: "2 hours ago",
  },
  {
    id: 3,
    title: "You have a new message from San",
    description: "Hello there, check this new items you may be interested in.",
    time: "1 day ago",
  },
  {
    id: 4,
    title: "You have a new message from Seeba",
    description: "Hello there, check this new items you may be interested in.",
    time: "30 minutes ago",
  },
];

const NotificationDropdown = ({ innerRef, onClose }) => {
  return (
    <div
      ref={innerRef}
      className="absolute -right-10 sm:right-0 top-12 z-50  w-[300px] sm:w-[400px] max-h-[500px] overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg py-4"
    >
      {/* Header with Clear, Mark as Read, and X button */}
      <div className="flex items-center justify-between px-4 mb-4 text-xs font-medium text-blue-600">
        <div className="flex gap-4">
          <button onClick={() => console.log("Clear all clicked")}>Clear all</button>
          <button onClick={() => console.log("Mark as read clicked")}>Mark as read</button>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={18} className="text-gray-500 hover:text-gray-900" />
        </button>
      </div>

      {/* Notifications List */}
      <ul className="divide-y divide-gray-200">
        {notifications.map((item) => (
          <li
            key={item.id}
            className="flex p-4 hover:bg-gray-50 cursor-pointer"
          >
            <div className=" sm:ml-4">
              <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
              <p className="text-xs text-blue-600 font-medium mt-1">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>

      <button
        className="text-xs font-medium text-blue-600 mt-4 px-4 mb-2 hover:underline"
        onClick={() => console.log("View all notifications clicked")}
      >
        View all Notifications
      </button>
    </div>
  );
};

export default NotificationDropdown;
