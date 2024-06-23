import { AreaChart, BarChart, Card, List, ListItem } from "@tremor/react";
import { Pencil2Icon, TriangleRightIcon } from "@radix-ui/react-icons";
import { SideBar } from "@/components/ui/SideBar";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";
import { formatWeekRange, valueFormatter } from "@/utils";
import { SupplyRatioData } from "@/models";

type DrinkId = number;
type DrinkName = string;

interface SaleData {
  sale_id: number;
  drink_id: DrinkId;
  sale_date: string;
  quantity_sold: number;
}

interface WeeklyTrend {
  week: string;
  topDrinkId: DrinkId;
  sales: number;
  drinkSales: Record<DrinkId, number>;
}

// ! This needs to be utilized
const drinkIdToName: Record<DrinkId, DrinkName> = {
  1: "Espresso",
  2: "Latte",
  3: "Cappuccino",
  4: "Americano",
  5: "Mocha",
  6: "Macchiato",
  7: "Flat White",
  8: "Affogato",
  9: "Cold Brew",
  10: "Chai Latte",
  11: "Matcha Latte",
  12: "Iced Tea",
  13: "Frappe",
  14: "Hot Chocolate",
  15: "Caramel Macchiato",
};

export default function Component({}) {
  // State variables
  const [currentGraph, setCurrentGraph] = useState<string>("Supply ratio");
  const [monthlyTrends, setMonthlyTrends] = useState<
    Record<string, WeeklyTrend[]>
  >({});
  const [selectedMonth, setSelectedMonth] = useState<string>("Feb 2024");
  const [sideIsVisible, setSideIsVisible] = useState<boolean>(true);

  // Static variables
  const graphs = ["Supply ratio", "Weekly trends", "Monthly sales"];
  const months = Object.keys(monthlyTrends);

  // Fetch and process data off of component mount
  useEffect(() => {
    // don't worry bout the logic
    const fetchAndProcessData = async () => {
      Papa.parse<string[]>(csvData, {
        complete: (result) => {
          const salesData: SaleData[] = result.data.slice(1).map((row) => ({
            sale_id: parseInt(row[0], 10),
            drink_id: parseInt(row[1], 10),
            sale_date: row[2],
            quantity_sold: parseInt(row[3], 10),
          }));

          processData(salesData);
        },
        header: false,
        skipEmptyLines: true,
      });
    };

    const formatWeekRange = (start: Date, end: Date) => {
      const formatDate = (date: Date) => {
        const month = date.toLocaleString("default", { month: "short" });
        return `${month} ${date.getDate()}`;
      };
      return `${formatDate(start)} - ${formatDate(end)}`;
    };

    const processData = (salesData: SaleData[]) => {
      const monthlyData: Record<string, WeeklyTrend[]> = {};

      salesData.forEach((sale) => {
        const date = new Date(sale.sale_date);
        const monthKey = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        const weekStart = new Date(
          date.setDate(date.getDate() - date.getDay())
        );
        const weekEnd = new Date(
          new Date(weekStart).setDate(weekStart.getDate() + 6)
        );
        const weekKey = formatWeekRange(weekStart, weekEnd);

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = [];
        }

        let weekData = monthlyData[monthKey].find((w) => w.week === weekKey);
        if (!weekData) {
          weekData = { week: weekKey, topDrinkId: 0, sales: 0, drinkSales: {} };
          monthlyData[monthKey].push(weekData);
        }

        if (!weekData.drinkSales[sale.drink_id]) {
          weekData.drinkSales[sale.drink_id] = 0;
        }
        weekData.drinkSales[sale.drink_id] += sale.quantity_sold;

        if (weekData.drinkSales[sale.drink_id] > weekData.sales) {
          weekData.topDrinkId = sale.drink_id;
          weekData.sales = weekData.drinkSales[sale.drink_id];
        }
      });

      setMonthlyTrends(monthlyData);
    };

    fetchAndProcessData();
  }, []);

  // Helper functions
  const getPreviousGraph = (current: string) => {
    const index = graphs.indexOf(current);
    return graphs[(index - 1 + graphs.length) % graphs.length];
  };

  const getNextGraph = (current: string) => {
    const index = graphs.indexOf(current);
    return graphs[(index + 1) % graphs.length];
  };

  const getPreviousMonth = (currentMonth: string) => {
    const currentIndex = months.indexOf(currentMonth);
    return months[(currentIndex - 1 + months.length) % months.length];
  };

  const getNextMonth = (currentMonth: string) => {
    const currentIndex = months.indexOf(currentMonth);
    return months[(currentIndex + 1) % months.length];
  };

  // Data pertaining to graphs

  /**
   * Data for the supply ratio graph
   * This data is in a format that can be used by the AreaChart component, and is taken through JSON.
   * See @types for this data structure.
   * Equation is as follows: Supply Ratio = Actual Utilized Inventory / Actual Full Total Inventory
   */
  const data: SupplyRatioData[] = [
    {
      date: "Jan 17",
      Actual: 1000,
      Utilized: 500,
    },
  ].map((item) => ({
    ...item,
    Ratio: item.Utilized === 0 ? 0 : item.Utilized / item.Actual,
  }));

  const csvData = ``; // This was filled with all_sales_data.csv, this needs to be changed back.

  /**
   * Data for the monthly trends graph
   * This data is in a raw CSV data format and is parsed by the useEffect hook.
   * This data will be in the format of sale_id,drink_id,sale_date,quantity_sold.
   */

  // define graphs here
  const monthlyTrend = () => {
    return (
      <>
        <Card className="mt-4 relative">
          <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Weekly trends - <b>{selectedMonth}</b>
          </h3>
          <button
            onClick={() => setSelectedMonth(getPreviousMonth(selectedMonth))}
            className="absolute top-2 right-10 p-2"
          >
            &#8592;
          </button>
          <button
            onClick={() => setSelectedMonth(getNextMonth(selectedMonth))}
            className="absolute top-2 right-2 p-2"
          >
            &#8594;
          </button>
          {selectedMonth && (
            <BarChart
              className="mt-6"
              data={monthlyTrends[selectedMonth]}
              index="week"
              categories={["sales"]}
              colors={["green"]}
              valueFormatter={(number) => `${number}`}
              yAxisWidth={48}
              showLegend={false}
            />
          )}
        </Card>
      </>
    );
  };

  const supplyRatio = () => {
    return (
      <>
        <Card className="sm:mx-auto sm:max-w-lg">
          <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            {currentGraph}
          </h3>
          <AreaChart
            data={data}
            index="date"
            categories={["Actual", "Utilized", "Ratio"]}
            colors={["blue", "violet", "gray"]}
            valueFormatter={valueFormatter}
            showLegend={false}
            showYAxis={false}
            showGradient={false}
            startEndOnly={true}
            className="mt-6 h-32"
          />
          <Card className="mx-auto mt-5 max-w-full">
            <p className="text-xl font-semibold text-white dark:text-dark-tremor-content">
              What is the ratio?
            </p>
            <p className="text-sm text-tremor-content-strong dark:text-dark-tremor-content-strong font-light">
              The supply ratio measures how effectively you're using your
              inventory. A higher ratio means better utilization. It's
              calculated as:
              <br />
              Supply Ratio = Actual Utilized Inventory / Actual Full Inventory
              <br />
              We track this ratio over time to see how well you're using your
              inventory.
            </p>
          </Card>
        </Card>
      </>
    );
  };

  const totalTrending = () => {};

  return (
    <div className="flex h-screen">
      {/* navigator bar on the siiide */}
      <motion.aside
        className="bg-[#3b3b3b] p-5 text-white"
        initial={{ width: "0" }}
        animate={{ width: sideIsVisible ? "16.666%" : "70px" }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => setSideIsVisible(true)}
        onMouseLeave={() => setSideIsVisible(false)}
      >
        <SideBar isVisible={sideIsVisible} />
      </motion.aside>

      {/* main area n shi */}
      <main className="flex-1 bg-white p-8">
        {/* data analytics n shi */}
        <section className="grid grid-cols-2 gap-6">
          {/* main card */}
          <Card className="mt-4 relative">
            <button
              onClick={() => setCurrentGraph(getPreviousGraph(currentGraph))}
              className="absolute top-2 right-10 p-2"
            >
              &#8592;
            </button>
            <button
              onClick={() => setCurrentGraph(getNextGraph(currentGraph))}
              className="absolute top-2 right-2 p-2"
            >
              &#8594;
            </button>
            {currentGraph === "Supply ratio" ? supplyRatio() : monthlyTrend()}
          </Card>
        </section>

        {/* clairvoyant */}

        {/* passenger */}

        {/* this rly dnot matter */}
        <header className="flex justify-between items-center mt-6">
          <div className="flex flex-row space-x-4">
            <Pencil2Icon className="w-6 h-6" />
            <span>
              Editing as <b>employee</b>
            </span>
          </div>
        </header>
      </main>
    </div>
  );
}
