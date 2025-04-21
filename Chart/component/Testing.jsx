import React, { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [chartType, setChartType] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [chartData, setChartData] = useState(null);

  const handleChartSelection = async (type) => {
    const fnName = prompt("Which function do you want to fetch data from?");
    if (!fnName) {
      alert("Function name is required!");
      return;
    }

    setChartType(type);
    setFunctionName(fnName);

    try {
      const res = await fetch(`/api/${fnName}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setChartData(null);
        return;
      }

      const labels = data.map((_, idx) => `Item ${idx + 1}`);
      const values = data.map((item) => item.value ?? item); // fallback if item is number

      const chartPayload = {
        labels,
        datasets: [
          {
            label: "My Data",
            data: values,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };

      setChartData(chartPayload);
    } catch (err) {
      console.error("Fetch error:", err);
      setChartData(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Select a Chart Type</h2>
      <div className="flex gap-4 mb-6">
        <button onClick={() => handleChartSelection("bar")} className="bg-blue-500 text-white px-4 py-2 rounded">Bar</button>
        <button onClick={() => handleChartSelection("line")} className="bg-green-500 text-white px-4 py-2 rounded">Line</button>
        <button onClick={() => handleChartSelection("pie")} className="bg-purple-500 text-white px-4 py-2 rounded">Pie</button>
      </div>

      {chartData && (
        <div className="max-w-xl mx-auto">
          {chartType === "bar" && <Bar data={chartData} />}
          {chartType === "line" && <Line data={chartData} />}
          {chartType === "pie" && <Pie data={chartData} />}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
