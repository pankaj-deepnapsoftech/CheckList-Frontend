import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const MainLayout = () => {

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col w-24">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 ">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
