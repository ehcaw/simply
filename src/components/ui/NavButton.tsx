import { useRouter } from "next/router";
import { HomeIcon } from "@radix-ui/react-icons";

interface DashButtonProps {
  className?: string;
}

export const NavButton: React.FC<DashButtonProps> = ({ className }) => {
  const router = useRouter();

  const handleClick = () => {
    // check if its local host or not
    if (typeof window !== "undefined") {
      // Client-side-only code
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        router.push("http://localhost:3000");
      } else {
        router.push("http://simply-two.vercel.app");
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-3 bg-gray-200 rounded-full tracking-tight btn btn-circle btn-ghost btn-info`}
    >
      <HomeIcon className="h-6 w-6 text-gray-800"></HomeIcon>
    </button>
  );
};
