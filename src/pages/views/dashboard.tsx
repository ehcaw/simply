import {
  AreaChart,
  BarChart,
  BarList,
  Card,
  Flex,
  List,
  ListItem,
} from "@tremor/react";
import { Pencil2Icon, TriangleRightIcon } from "@radix-ui/react-icons";
import { SideBar } from "@/components/ui/SideBar";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";
import { formatWeekRange, valueFormatter } from "@/utils";
import { SupplyRatioData } from "@/models";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

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
  const [monthlyTrends, setMonthlyTrends] = useState<
    Record<string, WeeklyTrend[]>
  >({});
  const [selectedMonth, setSelectedMonth] = useState<string>("Feb 2024");
  const [sideIsVisible, setSideIsVisible] = useState<boolean>(true);
  const [extended, setExtended] = useState(false);

  // Static variables
  const graphs = ["Supply ratio", "Weekly trends", "Monthly sales"];
  const months = Object.keys(monthlyTrends);

  const ClairvoyantSkeleton = () => {
    const variants = {
      initial: {
        backgroundPosition: "0 50%",
      },
      animate: {
        backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
      },
    };

    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={variants}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
        style={{
          background:
            "linear-gradient(-45deg, #f0fff0, #4d1228, #e607e2, #20332e)",
          backgroundSize: "400% 400%",
        }}
      >
        <motion.div className="h-full w-full rounded-lg"></motion.div>
      </motion.div>
    );
  };

  const PasssengerSkeleton = () => {
    const variants = {
      initial: {
        backgroundPosition: "0 50%",
      },
      animate: {
        backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
      },
    };

    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={variants}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
        style={{
          background:
            "linear-gradient(-45deg, #205278, #e73c7e, #23a6d5, #232078)",
          backgroundSize: "400% 400%",
        }}
      >
        <motion.div className="h-full w-full rounded-lg"></motion.div>
      </motion.div>
    );
  };

  const dualItems = [
    {
      title: "Clairvoyant",
      description: (
        <span className="text-sm">Use predictions to guide your business.</span>
      ),
      header: <ClairvoyantSkeleton />,
      className: "md:col-span-1",
      icon: <></>,
      url: "",
    },
    {
      title: "Passenger",
      description: (
        <span className="text-sm">
          Receive AI-powered suggestions for your business, utilizing your data
          to the fullest extent.
        </span>
      ),
      header: <PasssengerSkeleton />,
      className: "md:col-span-1",
      icon: <></>,
      url: "",
    },
  ];

  // Fetch and process data
  useEffect(() => {
    // don't worry bout the logic
    const fetchAndProcessData = async () => {
      Papa.parse<string[]>(totalData, {
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
  const supplyData = [
    {
      date: "Jan 23",
      Actual: 234,
      Utilized: 173,
    },
    {
      date: "Feb 23",
      Actual: 241,
      Utilized: 202,
    },
    {
      date: "Mar 23",
      Actual: 291,
      Utilized: 279,
    },
    {
      date: "Apr 23",
      Actual: 101,
      Utilized: 98,
    },
    {
      date: "May 23",
      Actual: 318,
      Utilized: 192,
    },
    {
      date: "Jun 23",
      Actual: 205,
      Utilized: 189,
    },
    {
      date: "Jul 23",
      Actual: 372,
      Utilized: 370,
    },
    {
      date: "Aug 23",
      Actual: 341,
      Utilized: 321,
    },
    {
      date: "Sep 23",
      Actual: 387,
      Utilized: 289,
    },
    {
      date: "Oct 23",
      Actual: 220,
      Utilized: 200,
    },
    {
      date: "Nov 23",
      Actual: 372,
      Utilized: 370,
    },
    {
      date: "Dec 23",
      Actual: 321,
      Utilized: 300,
    },
  ].map((item) => ({
    ...item,
    Ratio: item.Utilized === 0 ? 0 : item.Utilized / item.Actual,
  }));

  // Graphs that rely on total sales data

  /**
   * Data for the total supply ratio graph
   * This data is in a raw CSV data format and is parsed by the useEffect hook.
   * It contains actual utilized, actual total, and the ratio between the two.
   */
  const totalData = ``; // This was filled with all_sales_data.csv, this needs to be changed back.

  const totalPopularData = [
    {
      name: "/home",
      value: 2019,
    },
    {
      name: "/blocks",
      value: 1053,
    },
    {
      name: "/components",
      value: 997,
    },
    {
      name: "/docs/getting-started/installation",
      value: 982,
    },
    {
      name: "/docs/components/button",
      value: 782,
    },
    {
      name: "/docs/components/table",
      value: 752,
    },
    {
      name: "/docs/components/area-chart",
      value: 741,
    },
    {
      name: "/docs/components/badge",
      value: 750,
    },
  ]; // This should be filled with data parsed from all_sales_data.csv and renamed accordingly

  const doubleSection = () => {
    return (
      <>
        <Card></Card>
      </>
    );
  };

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
            Supply ratio
          </h3>
          <AreaChart
            data={supplyData}
            index="date"
            categories={["Actual", "Utilized", "Ratio"]}
            colors={["blue", "violet", "gray"]}
            valueFormatter={valueFormatter}
            showLegend={false}
            showYAxis={false}
            showGradient={false}
            startEndOnly={true}
            className="mt-6 h-full w-full"
          />
          <Card className="mx-auto mt-5 max-w-full">
            <p className="text-xl font-semibold text-white dark:text-dark-tremor-content">
              What is the ratio?
            </p>
            <p className="text-sm text-tremor-content-strong dark:text-dark-tremor-content-strong font-light">
              The supply ratio measures how effectively you're using your
              inventory. The higher the ratio, the better that you're utilizing
              your inventory. It's calculated as:
              <br /> <br />
              <span className="text-xs">
                Supply Ratio = Actual Utilized Inventory / Actual Full Inventory
              </span>
              <br />
              We track this ratio over time as your company grows to see how
              well you're using your inventory.
            </p>
          </Card>
        </Card>
      </>
    );
  };

  const totalTrending = () => {
    return (
      <>
        <Card className="p-0 sm:mx-auto sm:max-w-lg">
          <div className="flex items-center justify-between border-b border-tremor-border p-6 dark:border-dark-tremor-border">
            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Top pages
            </p>
            <p className="text-tremor-label font-medium uppercase text-tremor-content dark:text-dark-tremor-content">
              Visitors
            </p>
          </div>
          <div
            className={`overflow-hidden p-6 ${extended ? "" : "max-h-[260px]"}`}
          >
            <BarList data={totalPopularData} valueFormatter={valueFormatter} />
          </div>

          <div
            className={`flex justify-center ${
              extended
                ? "px-6 pb-6"
                : "absolute inset-x-0 bottom-0 rounded-b-tremor-default bg-gradient-to-t from-tremor-background to-transparent py-7 dark:from-dark-tremor-background"
            }`}
          >
            <button
              className="flex items-center justify-center rounded-tremor-small border border-tremor-border bg-tremor-background px-2.5 py-2 text-tremor-default font-medium text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input hover:dark:bg-dark-tremor-background-muted"
              onClick={() => setExtended(!extended)}
            >
              {extended ? "Show less" : "Show more"}
            </button>
          </div>
        </Card>
      </>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#001c3d]">
      {/* Sidebar */}
      <motion.aside
        className="bg-[#001c3d] p-5 text-white"
        initial={{ width: "0" }}
        animate={{ width: sideIsVisible ? "16.666%" : "70px" }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => setSideIsVisible(true)}
        onMouseLeave={() => setSideIsVisible(false)}
      >
        <SideBar isVisible={sideIsVisible} />
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-3 gap-4 h-full">
          <div className="col-span-2">
            <Card className="h-full mb-4">{supplyRatio()}</Card>
          </div>
          <div>
            <Card className="h-full mb-4">{monthlyTrend()}</Card>
          </div>
          <div>
            <BentoGrid className="flex flex-col gap-4">
              {dualItems.map((item, i) => (
                <BentoGridItem
                  key={i}
                  title={item.title}
                  description={item.description}
                  header={item.header}
                  icon={item.icon}
                />
              ))}
            </BentoGrid>
          </div>
          <div className="col-span-2">
            <Card className="h-full">{totalTrending()}</Card>
          </div>
        </div>
      </div>
    </div>
  );
}
