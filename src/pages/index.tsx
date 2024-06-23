import { Inter } from "next/font/google";
import Component from "./views/dashboard";
import { LineChartUsageExample } from "@/components/tremor/linechart";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <Component />;
}
