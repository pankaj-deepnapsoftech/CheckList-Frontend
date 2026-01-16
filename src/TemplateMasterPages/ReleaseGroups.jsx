import React, { useState } from "react";
import { Search, Plus, Eye, Edit2 } from "lucide-react";
import Pagination from "../Components/Pagination/Pagination";
import NoDataFound from "../components/NoDataFound/NoDataFound";
import AddReleaseGroupModal from "../components/TemplateModals/AddModal/ReleaseGroupModal";
import ViewReleaseGroupModal from "../components/TemplateModals/ViewModal/ReleaseGroupViewModal";

const ReleaseGroups = () => {
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const [openModal, setOpenModal] = useState(false);
    const [mode, setMode] = useState("add");
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [viewOpen, setViewOpen] = useState(false);

    const releaseGroups = [
        {
            _id: "1",
            group_name: "Assembly Release",
            group_department: "Production",
            groupusers: 5,
        },
        {
            _id: "2",
            group_name: "Quality Review",
            group_department: "Quality",
            groupusers: 3,
        },
    ];

    // Search filter
    const filteredGroups = releaseGroups.filter((g) =>
        g.group_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-semibold">Release Groups</h1>
                <p className="text-gray-500 text-sm">
                    Manage release group information
                </p>
            </div>

            {/* Search + Add */}
            <div className="bg-white shadow-sm rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-300 rounded-lg px-3 py-2">
                    <Search size={20} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search release groups..."
                        className="w-full outline-none text-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    onClick={() => {
                        setMode("add");
                        setSelectedGroup(null);
                        setOpenModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
                >
                    <Plus size={18} /> Add Release Group
                </button>

            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-6 p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                    <h2 className="font-semibold text-gray-800 text-lg">
                        {filteredGroups.length} Release Groups Found
                    </h2>

                    <div className="flex items-center gap-4 text-gray-600">
                        <span>Show:</span>
                        <select
                            className="border border-gray-200 rounded-lg px-2 py-1"
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full min-w-[700px] text-left">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm">
                                <th className="px-5 py-3 font-semibold">Group Name</th>
                                <th className="px-5 py-3 font-semibold">Department</th>
                                <th className="px-5 py-3 font-semibold">Users Count</th>
                                <th className="px-5 py-3 font-semibold text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredGroups.length === 0 ? (
                                <NoDataFound
                                    title="0 Release Groups Found"
                                    subtitle="No release groups available."
                                    colSpan={4}
                                />
                            ) : (
                                filteredGroups.map((g) => (
                                    <tr
                                        key={g._id}
                                        className="hover:bg-blue-50 transition"
                                    >
                                        <td className="px-5 py-4 font-medium text-gray-800">
                                            {g.group_name}
                                        </td>
                                        <td className="px-5 py-4">{g.group_department}</td>
                                        <td className="px-5 py-4">{g.groupusers}</td>
                                        <td className="px-5 py-4 flex justify-center gap-5">
                                            {/* VIEW */}
                                            <Eye
                                                size={20}
                                                className="text-blue-500 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedGroup(g);
                                                    setViewOpen(true);
                                                }}
                                            />

                                            {/* EDIT */}
                                            <Edit2
                                                size={20}
                                                className="text-green-600 cursor-pointer"
                                                onClick={() => {
                                                    setMode("edit");
                                                    setSelectedGroup(g);
                                                    setOpenModal(true);
                                                }}
                                            />
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination
                page={page}
                setPage={setPage}
                hasNextpage={filteredGroups.length === limit}
            />

            {/* Modal-Add  */}
            <AddReleaseGroupModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                editData={selectedGroup}
                mode={mode}
            />

            {/* Modal-View  */}
            <ViewReleaseGroupModal
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                data={selectedGroup}
            />
        </div>
    );
};

export default ReleaseGroups;
