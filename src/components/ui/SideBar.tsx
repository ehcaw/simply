import {
  LayoutDashboardIcon,
  ActivityIcon,
  UserIcon,
  SettingsIcon,
  HandHelpingIcon,
  BellDotIcon,
} from "lucide-react";
import Image from "next/image";

interface SideBarProps {
  isVisible: boolean;
}

export function SideBar({ isVisible }: SideBarProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="sidebar-title flex items-center space-x-2 p-4 bg-gray-650">
        <Image
          src="/simplylogo.png"
          alt="Logo"
          className="invert"
          width={50}
          height={50}
        />
        <h1
          className={`text-white text-xl font-bold ${
            isVisible ? "" : "hidden"
          }`}
        >
          Simply
        </h1>
      </div>
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <LayoutDashboardIcon className={`h-6 w-6`} />
        <button></button> {/* Placeholder button */}
        <span className={`${isVisible ? "" : "hidden"}`}>
          <b>Dashboard</b>
        </span>
      </div>
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <UserIcon className="h-6 w-6" />
        <button onClick={() => "/settings"}></button>
        <span className={`${isVisible ? "" : "hidden"}`}>
          <b>Management</b>
        </span>
      </div>
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <BellDotIcon className="h-6 w-6" />
        <button onClick={() => "/employees"}></button>
        <span className={`${isVisible ? "" : "hidden"}`}>
          <b>Notifications</b>
        </span>
      </div>
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <ActivityIcon className="h-6 w-6" />
        <button onClick={() => "/statistics"}></button>
        <span className={`${isVisible ? "" : "hidden"}`}>
          <b>Updates</b>
        </span>
      </div>
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <HandHelpingIcon className="h-6 w-6" />
        <button onClick={() => "/help"}></button>
        <span className={`${isVisible ? "" : "hidden"}`}>
          <b>Help</b>
        </span>
      </div>
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <SettingsIcon className="h-6 w-6" />
        <button onClick={() => "/settings"}></button>
        <span className={`${isVisible ? "" : "hidden"}`}>
          <b>Settings</b>
        </span>
      </div>
    </div>
  );
}
