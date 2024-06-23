import { Card, LineChart } from "@tremor/react";

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
    "Pasta Orders": 75,
    "Pasta Purchases": 40,
  },
  {
    date: "Apr '24",
    "Pasta Orders": 52,
    "Pasta Purchases": 48,
  },
  {
    date: "May '24",
    "Pasta Orders": 40,
    "Pasta Purchases": 52,
  },
  {
    date: "June '24",
    "Pasta Orders": 60,
    "Pasta Purchases": 52,
  },
];

const dataFormatter = (number: number) =>
  `$${Intl.NumberFormat("us").format(number).toString()}`;

export function LineChartEx() {
  return (
    <LineChart
      className="h-80"
      data={hardCodedData}
      index="date"
      categories={["SolarPanels", "Inverters"]}
      colors={["indigo", "rose"]}
      valueFormatter={dataFormatter}
      yAxisWidth={60}
      onValueChange={(v) => console.log(v)}
    />
  );
}
