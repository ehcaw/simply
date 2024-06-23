import { Card, LineChart } from "@tremor/react";
import { ValueFormatter } from "@tremor/react";

const hardCodedData = [
  {
    date: "Jan '24",
    pastaorders: 30,
    pastapurchases: 30,
  },
  {
    date: "Feb '24",
    pastaorders: 74,
    pastapurchases: 130,
  },
  {
    date: "Mar '24",
    pastaorders: 75,
    pastapurchases: 40,
  },
  {
    date: "Apr '24",
    pastaorders: 52,
    pastapurchases: 48,
  },
  {
    date: "May '24",
    pastaorders: 40,
    pastapurchases: 52,
  },
  {
    date: "June '24",
    pastaorders: 60,
    pastapurchases: 52,
  },
];

const valueFormatter: ValueFormatter = function (number: number) {
  return `$${number}`;
};

export function LineChartUsageExample() {
  return (
    <>
      <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        lmaooo idk
      </h3>
      <LineChart
        className="mt-4 h-72"
        data={hardCodedData}
        index="date"
        categories={["pastaorders", "pastapurchases"]}
        colors={["white", "red"]}
        valueFormatter={valueFormatter}
        showAnimation={true}
        showXAxis={true}
        showYAxis={true}
      />
    </>
  );
}
LineChartUsageExample.displayName = "LineChartUsageExample";
