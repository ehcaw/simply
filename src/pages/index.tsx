import { Inter } from "next/font/google";
import Dashboard from "./views/dashboard";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`bg-white flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Dashboard></Dashboard>
    </main>
  );
}
