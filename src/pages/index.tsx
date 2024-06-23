import { Inter } from "next/font/google";
import Component from "./views/dashboard";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <Component />;
}
