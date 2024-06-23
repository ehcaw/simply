// src/pages/views/dashboard.tsx
import { AreaChart, BarChart, BarList, Card } from "@tremor/react";
import { SideBar } from "@/components/ui/SideBar";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";
import { valueFormatter } from "@/utils";
import { SupplyRatioData, PredictedSupplyData } from "@/models";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  totalPurchaseDataCSV,
  supplyDataCSV,
  predictedSupplyCSV,
} from "@/data";

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

interface DrinkSales {
  name: string;
  value: number;
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
  const [view, setView] = useState<number>(0); // 0 for dash, 1 for clair, 2 for pass
  const [selectedMonth, setSelectedMonth] = useState<string>("Feb 2024");
  const [sideIsVisible, setSideIsVisible] = useState<boolean>(true);
  const [monthlyTrends, setMonthlyTrends] = useState<
    Record<string, WeeklyTrend[]>
  >({});
  const [totalPopularData, setTotalPopularData] = useState<DrinkSales[]>([]);
  const [supplyRatioData, setSupplyRatioData] = useState<SupplyRatioData[]>([]);
  const [predictedSupplyData, setPredictedSupplyData] = useState<
    PredictedSupplyData[]
  >([]);

  // Static variables
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

  // Fetch and process data off rip
  useEffect(() => {
    // Assuming you have your CSV data in a string variable called 'csvData'
    Papa.parse<string[]>(totalPurchaseDataCSV, {
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
  }, []);

  useEffect(() => {
    // don't worry bout the logic
    const fetchAndProcessData = async () => {
      Papa.parse<string[]>(totalPurchaseDataCSV, {
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

  useEffect(() => {
    setSupplyRatioData(parseSupplyRatioData(supplyDataCSV));
  }, []);

  useEffect(() => {
    setPredictedSupplyData(parsePredictedSupplyData(predictedSupplyCSV));
  }, []);

  // Helper functions
  const getPreviousMonth = (currentMonth: string) => {
    const currentIndex = months.indexOf(currentMonth);
    return months[(currentIndex - 1 + months.length) % months.length];
  };

  const getNextMonth = (currentMonth: string) => {
    const currentIndex = months.indexOf(currentMonth);
    return months[(currentIndex + 1) % months.length];
  };

  const processData = (salesData: SaleData[]) => {
    const totalSales: Record<number, number> = {};

    salesData.forEach((sale) => {
      if (!totalSales[sale.drink_id]) {
        totalSales[sale.drink_id] = 0;
      }
      totalSales[sale.drink_id] += sale.quantity_sold;
    });

    const formattedData: DrinkSales[] = Object.entries(totalSales)
      .map(([drinkId, totalSold]) => ({
        name: drinkIdToName[parseInt(drinkId)] || `${drinkId}`,
        value: totalSold,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    setTotalPopularData(formattedData);
  };

  const parseSupplyRatioData = (csvData: string): SupplyRatioData[] => {
    const parsedData: SupplyRatioData[] = [];

    Papa.parse<string[]>(csvData, {
      complete: (result) => {
        parsedData.push(
          ...result.data.slice(1).map((row, index) => {
            const actual = parseInt(row[0], 10);
            const utilized = parseInt(row[1], 10);
            return {
              date: `Week ${index + 1}`, // You might want to replace this with actual dates
              Actual: actual,
              Utilized: utilized,
              Predicted: parseInt(row[2], 10),
              Ratio: utilized === 0 ? 0 : utilized / actual,
            };
          })
        );
      },
      header: false,
      skipEmptyLines: true,
    });

    return parsedData;
  };

  const parsePredictedSupplyData = (csvData: string): PredictedSupplyData[] => {
    const parsedData: PredictedSupplyData[] = [];

    Papa.parse<string[]>(csvData, {
      complete: (result) => {
        parsedData.push(
          ...result.data.slice(1).map((row) => {
            const date = new Date(row[0]);
            const shortDate = `${date.toLocaleString("default", {
              month: "short",
            })} ${date.getDate()}`;
            return {
              date: shortDate,
              Predicted: Math.round(parseFloat(row[4])), // Rounding to nearest integer
            };
          })
        );
      },
      header: false,
      skipEmptyLines: true,
    });

    return parsedData;
  };

  const renderView = () => {
    switch (view) {
      case 0:
        return <>{renderDashboard()}</>;
      case 1:
        return <>{renderClairvoyant()}</>;
      case 2:
        return <>{renderPassenger()}</>;
    }
  };

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
            data={supplyRatioData}
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
              Most popular items of all-time
            </p>
            <p className="text-tremor-label font-medium uppercase text-tremor-content dark:text-dark-tremor-content">
              total sales
            </p>
          </div>
          <div className={`overflow-hidden p-6 max-h-[260px]}`}>
            <BarList data={totalPopularData} valueFormatter={valueFormatter} />
          </div>
        </Card>
      </>
    );
  };

  const predictedSupply = () => {
    return (
      <Card className="sm:mx-auto sm:max-w-lg">
        <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Predicted supply data
        </h3>
        <AreaChart
          data={predictedSupplyData}
          index="date"
          categories={["Predicted"]}
          colors={["blue"]}
          valueFormatter={valueFormatter}
          showLegend={false}
          showYAxis={false}
          showGradient={false}
          startEndOnly={true}
          className="mt-6 h-64 w-full"
        />
      </Card>
    );
  };

  /**
   * All views are rendered here to play with state
   */
  const renderDashboard = () => {
    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-3 gap-4 h-full">
          <div className="col-span-2">
            <Card className="h-[95%]">{supplyRatio()}</Card>
          </div>
          <div>
            <Card className="h-[95%] mb-6">{monthlyTrend()}</Card>
          </div>
          <div>
            <BentoGrid className="flex flex-col">
              {dualItems.map((item, i) => (
                <BentoGridItem
                  key={i}
                  title={item.title}
                  description={item.description}
                  header={item.header}
                  onClick={() => {
                    setView(i + 1);
                  }}
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
    );
  };

  const renderClairvoyant = () => {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="flex justify-between w-full max-w-4xl px-4">
          <div className="w-[48%]">
            <Card className="mx-auto max-w-xs">{predictedSupply()}</Card>
          </div>
          <div className="w-[48%]">
            <Card className="mx-auto max-w-xs">
              <p className="text-center text-slate-400">We predict..</p>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderPassenger = () => {
    return (
      <div className="h-[95vh] mx-auto my-[2.5vh] px-4 flex justify-center items-center">
        <div className="flex justify-between w-full max-w-4xl">
          <div className="w-[48%]">
            <Card className="mx-auto max-w-xs">
              <p className="text-center text-slate-400">We suggest..</p>
            </Card>
          </div>
          <div className="w-[48%]">
            <Card className="mx-auto max-w-xs">
              <p className="text-center text-slate-400">We suggest..</p>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#001122]">
      {/* Sidebar */}
      <motion.aside
        className="bg-opacity-0 border-right border-white p-5 text-white flex items-center justify-center"
        initial={{ width: "0" }}
        animate={{ width: sideIsVisible ? "16.666%" : "70px" }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => setSideIsVisible(true)}
        onMouseLeave={() => setSideIsVisible(false)}
      >
        <SideBar isVisible={sideIsVisible} />
      </motion.aside>
      {/* Main content */}
      {renderView()}
    </div>
  );
}
