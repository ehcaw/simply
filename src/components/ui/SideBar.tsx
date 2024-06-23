import React from "react";
import {
  LayoutDashboardIcon,
  ActivityIcon,
  UserIcon,
  SettingsIcon,
  HandHelpingIcon,
  BellDotIcon,
} from "lucide-react";

interface SideBarProps {
  isVisible: boolean;
}

export const SideBar: React.FC<SideBarProps> = ({ isVisible }) => {
  const notImplemented = () => {
    alert("This feature is not yet implemented.");
    console.log("This feature is not yet implemented.");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title flex items-center space-x-2 p-4 bg-gray-650">
        <img
          src="/simply.png"
          alt="Logo"
          className="h-10 w-10"
        />
        <h1 className={`text-white text-xl font-bold ${isVisible ? "" : "hidden"}`}>Simply</h1>
      </div>

      <div className="flex flex-col space-y-6 p-4 justify-start">
        <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30 pt-12 items-center">
          <button onClick={notImplemented} className = "-ml-5"><LayoutDashboardIcon className={`h-6 w-6`} /></button>
          <span className={`${isVisible ? "" : "hidden"}`} onClick={notImplemented}>
            <b>Dashboard</b>
          </span>
        </div>
        <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30 pt-3 justify-start items-center">
          <button className = "-ml-5" onClick={notImplemented} aria-label="Management"> <UserIcon className={`h-6 w-6`} /></button>
          <span className={`${isVisible ? "" : "hidden"}`} onClick={notImplemented}>
            <b>Management</b>
          </span>
        </div>
        <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30 pt-3 justify-start items-center">
          <button onClick={notImplemented} className = "-ml-5"><BellDotIcon className={`h-6 w-6`} /></button>
          <span className={`${isVisible ? "" : "hidden"}`} onClick={notImplemented}>
            <b>Notifications</b>
          </span>
        </div>
        <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30 pt-3 justify-start items-center">
          <button onClick={notImplemented} className = "-ml-5"><ActivityIcon className={`h-6 w-6`} /></button>
          <span className={`${isVisible ? "" : "hidden"}`} onClick={notImplemented}>
            <b>Updates</b>
          </span>
        </div>
        <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30 pt-3 justify-start items-center">
          <button onClick={notImplemented} className = "-ml-5"><HandHelpingIcon className={`h-6 w-6`} /></button>
          <span className={`${isVisible ? "" : "hidden"}`} onClick={notImplemented}>
            <b>Help</b>
          </span>
        </div>
        <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30 pt-3 justify-start items-center">
          <button onClick={notImplemented} className = "-ml-5"><SettingsIcon className={`h-6 w-6`}/></button>
          <span onClick={notImplemented} className={`${isVisible ? "" : "hidden"}`} >
            <b>Settings</b>
          </span>
        </div>
      </div>
    </div>
  );
};