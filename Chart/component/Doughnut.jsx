import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Doughnut, Line } from "react-chartjs-2";
import { FaTrash } from "react-icons/fa";

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

function App({ functionName, deleteChart, index }) {
  const [chartData, setChartData] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const isMountedRef = useRef(true);
  const [destructuredValues, setDestructuredValues] = useState({ value1: null, value2: null, functionName: null });

  console.log("fu", functionName);

  useEffect(() => {
    if (!functionName) return;

    const match = functionName.match(/\(([^)]+)\)/); // Get content inside parentheses
    if (match) {
      const params = match[1].split(',').map(param => param.trim()); // Split parameters
      const pureFunctionName = functionName.split('(')[0]; // Get function name before '('
      setDestructuredValues({ functionName: pureFunctionName, params });
    }
  }, [functionName]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false; // When component unmounts, mark it
    };
  }, []);

  useEffect(() => {
    if (!destructuredValues.functionName || destructuredValues.params.length === 0) return;

    const intervalId = setInterval(() => {
      // Dynamically construct the URL
      const dynamicURL = `${BASE_URL}/testing/${destructuredValues.functionName}/${destructuredValues.params.join('/')}`;

      axios.get(dynamicURL).then((res) => {
       
        const { datasets, labels } = res.data.result;
        
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
      }).catch(error => {
        console.error("Error fetching chart data:", error);
      });
    }, 1000); // 1000ms = 1 second interval for live updates

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [destructuredValues]);

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold mb-4">Live Stats</h2>
      {chartData ? (
        <Doughnut height={900} width={720} data={chartData} options={{ responsive: true }} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default App;
