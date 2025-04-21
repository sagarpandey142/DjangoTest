import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function App() {
  const [chartData, setChartData] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    axios.get(`${BASE_URL}/innerflap-min-chart`).then((res) => {
      const { datasets, labels } = res.data.result;

      // Add colors if needed
      const coloredDatasets = datasets.map((ds, i) => ({
        ...ds,
        borderColor: ["#36a2eb", "#4bc0c0", "#ff6384"][i % 3],
        backgroundColor: ["#36a2eb", "#4bc0c0", "#ff6384"][i % 3],
        tension: 0.3,
        fill: false,
      }));

      setChartData({
        labels,
        datasets: coloredDatasets
      });
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Live Stats</h2>
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default App;
