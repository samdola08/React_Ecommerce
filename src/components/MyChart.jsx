// src/components/MyChart.jsx
import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const MyChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const options = {
      chart: { type: "line", height: 350 },
      series: [{ name: "Example", data: [10, 20, 30, 40] }],
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr"] },
    };

    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      // ☑️ cleanup— কম্পোনেন্ট unmount হলে চার্ট destroy করবেন
      return () => chart.destroy();
    }
  }, []);

  return <div id="chart" ref={chartRef}></div>;
};

export default MyChart;
