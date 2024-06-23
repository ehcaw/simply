import { Inter } from "next/font/google";
import Dashboard from "./views/dashboard";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  return <Dashboard></Dashboard>;
}
