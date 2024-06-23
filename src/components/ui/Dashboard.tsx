import {
  LayoutDashboardIcon,
  SettingsIcon,
  UserIcon,
  BarChartIcon,
  MessagesSquareIcon,
  SignalIcon,
  HandHelpingIcon,
} from "lucide-react";
import { NavButton } from "./NavButton";
import { useRouter } from "next/router";

export function Dashboard({
  onClick,
}: {
  onClick: (featureId: string) => void;
}) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-3">
        <LayoutDashboardIcon className="h-6 w-6" />
        <NavButton />
        <span>Dashboard</span>
      </div>
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-6 w-6" />
        <button onClick={() => onClick("/settings")}></button>
        <span>Settings</span>
      </div>
      <div className="flex flex-row items-center space-x-3">
        <button onClick={() => onClick("/employees")}>
          <UserIcon className="h-6 w-6" />
          <span>Employees</span>
        </button>
      </div>
      <div className="flex items-center space-x-3">
        <BarChartIcon className="h-6 w-6" />
        <button onClick={() => onClick("/statistics")}></button>
        <span>Statistics</span>
      </div>
      <div className="flex items-center space-x-3">
        <MessagesSquareIcon className="h-6 w-6" />
        <button onClick={() => onClick("/messages")}></button>
        <span>Messages</span>
      </div>
      <div className="flex items-center space-x-3">
        <SignalIcon className="h-6 w-6" />
        <button onClick={() => onClick("/notifications")}></button>
        <span>Notifications</span>
      </div>
      <div className="flex items-center space-x-3">
        <HandHelpingIcon className="h-6 w-6" />
        <button onClick={() => onClick("/help")}></button>
        <span>Help</span>
      </div>
    </div>
  );
}
