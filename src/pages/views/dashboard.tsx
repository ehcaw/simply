import { AreaChart, Card, List, ListItem } from "@tremor/react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Dashboard } from "@/components/ui/SideBar";
import { useRouter } from "next/router";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Component() {
  const router = useRouter();

  const summary = [
    {
      name: "Organic",
      value: 3273,
    },
    {
      name: "Sponsored",
      value: 120,
    },
  ];

  const valueFormatter = (number: number) =>
    `${Intl.NumberFormat("us").format(number).toString()}`;

  const statusColor: { [key: string]: string } = {
    Organic: "bg-blue-500",
    Sponsored: "bg-violet-500",
  };

  const data = [
    {
      date: "Jan 23",
      Organic: 232,
      Sponsored: 0,
    },
    {
      date: "Feb 23",
      Organic: 241,
      Sponsored: 0,
    },
    {
      date: "Mar 23",
      Organic: 291,
      Sponsored: 0,
    },
    {
      date: "Apr 23",
      Organic: 101,
      Sponsored: 0,
    },
    {
      date: "May 23",
      Organic: 318,
      Sponsored: 0,
    },
    {
      date: "Jun 23",
      Organic: 205,
      Sponsored: 0,
    },
    {
      date: "Jul 23",
      Organic: 372,
      Sponsored: 0,
    },
    {
      date: "Aug 23",
      Organic: 341,
      Sponsored: 0,
    },
    {
      date: "Sep 23",
      Organic: 387,
      Sponsored: 120,
    },
    {
      date: "Oct 23",
      Organic: 220,
      Sponsored: 0,
    },
    {
      date: "Nov 23",
      Organic: 372,
      Sponsored: 0,
    },
    {
      date: "Dec 23",
      Organic: 321,
      Sponsored: 0,
    },
  ];

  return (
    <div className="flex h-screen">
      {/* navigator bar on the siiide */}
      <aside className="w-1/6 bg-[#3b3b3b] p-5 text-white">
        <Dashboard />
      </aside>

      {/* main area n shi */}
      <main className="flex-1 bg-white p-8">
        {/* data analytics n shi */}
        <section className="grid grid-cols-3 gap-6">
          <Card className="sm:mx-auto sm:max-w-lg">
            <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Follower metrics
            </h3>
            <AreaChart
              data={data}
              index="date"
              categories={["Organic", "Sponsored"]}
              colors={["blue", "violet"]}
              valueFormatter={valueFormatter}
              showLegend={false}
              showYAxis={false}
              showGradient={false}
              startEndOnly={true}
              className="mt-6 h-32"
            />
            <List className="mt-2">
              {summary.map((item) => (
                <ListItem key={item.name}>
                  <div className="flex items-center space-x-2">
                    <span
                      className={classNames(
                        statusColor[item.name],
                        "h-0.5 w-3"
                      )}
                      aria-hidden={true}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {valueFormatter(item.value)}
                  </span>
                </ListItem>
              ))}
            </List>
          </Card>
        </section>

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
