import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Doughnut, Line } from "react-chartjs-2";
import {FaTrash} from "react-icons/fa"

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

function App({functionName,deleteChart,index}) {
  const [chartData, setChartData] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const isMountedRef = useRef(true);
  const [destructuredValues, setDestructuredValues] = useState({ value1: null, value2: null });
  console.log("fu",functionName)
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
      return () => {
        isMountedRef.current = false; // when component unmounts, mark it
      };
    }, []);

    
  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get(`${BASE_URL}/get_gauge_graph/${destructuredValues.value1?? 0}/${destructuredValues.value2 ?? 100}`).then((res) => {
        const { datasets, labels } = res.data.result.rows[0].get_gauge_graph
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
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold mb-4">Live Stats</h2>
     
      {chartData ? (
        <Doughnut height={900} width={720} data={chartData}  options={{ responsive: true }}
   />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default App;
