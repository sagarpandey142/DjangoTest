import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut, Line } from "react-chartjs-2";
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

function App({functionName}) {
  const [chartData, setChartData] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [destructuredValues, setDestructuredValues] = useState({ value1: null, value2: null });
 
   useEffect(() => {
      if (!functionName) return;
    
      const match = functionName.match(/\(([^)]+)\)/); // get content inside parentheses
      if (match) {
        const numbers = match[1].split(',').map(num => parseInt(num.trim(), 10));
        const [value1, value2] = numbers;
        setDestructuredValues({ value1, value2 });
      }
    }, [functionName]);
   
  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get(`${BASE_URL}/get_bar_chart_json/${destructuredValues.value1?? 0}/${destructuredValues.value2 ?? 100}`).then((res) => {
        const { datasets, labels } = res.data?.result?.rows[0]?.get_bar_chart_json

        ;
       
        // Map colors or any other styling options
        const coloredDatasets = datasets?.map((ds, i) => ({
          ...ds,
          borderColor: ["#36a2eb", "#4bc0c0", "#ff6384"][i % 3],
          backgroundColor: ["#36a2eb", "#4bc0c0", "#ff6384"][i % 3],
          tension: 0.3,
          fill: false,
        }));

        setChartData({
          labels,
          datasets: coloredDatasets,
        });
       });
     }, 1000); // 5000ms = 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [destructuredValues]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Live Stats</h2>
      {chartData ? (
        <Bar  data={chartData}  options={{ responsive: true }}
   />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default App;
