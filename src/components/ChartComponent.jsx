import React from "react";
import ReactApexChart from "react-apexcharts";

const ChartComponent = () => {
  const options = {
    chart: {
      id: "sales-chart",
      type: "line",
      height: 350,
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  };

  const series = [
    {
      name: "Sales",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
    },
  ];

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default ChartComponent;
