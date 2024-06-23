import {
  LayoutDashboardIcon,
  ActivityIcon,
  UserIcon,
  SettingsIcon,
  HandHelpingIcon,
  BellDotIcon,
} from "lucide-react";

export function SideBar(isVisible: { isVisible: boolean}) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <LayoutDashboardIcon className="h-6 w-6" />
        <button></button> {/* if it works, it works */}
        <span>
          <b>Dashboard</b>
        </span>
      </div>
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <UserIcon className="h-6 w-6" />
        <button onClick={() => "/settings"}></button>
        <span>
          <b>Management</b>
        </span>
      </div>
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <BellDotIcon className="h-6 w-6" />
        <button onClick={() => "/employees"}></button>
        <span>
          <b>Notifications</b>
        </span>
      </div>
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <ActivityIcon className="h-6 w-6" />
        <button onClick={() => "/statistics"}></button>
        <span>
          <b>Updates</b>
        </span>
      </div>
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <HandHelpingIcon className="h-6 w-6" />
        <button onClick={() => "/help"}></button>
        <span>
          <b>Help</b>
        </span>
      </div>
      <div className="flex space-x-2 hover:bg-gray-500 rounded-xl hover:bg-opacity-30 hover:opacity-30">
        <SettingsIcon className="h-6 w-6" />
        <button onClick={() => "/settings"}></button>
        <span>
          <b>Settings</b>
        </span>
      </div>
    </div>
  );
}
