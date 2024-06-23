// src/utils/index.tsx
export const formatWeekRange = (start: Date, end: Date) => {
  const formatDate = (date: Date) => {
    const month = date.toLocaleString("default", { month: "short" });
    return `${month} ${date.getDate()}`;
  };
  return `${formatDate(start)} - ${formatDate(end)}`;
};

export const valueFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;
