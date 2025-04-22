import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
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

function Textbox({ functionName }) {
  const [Data, setData] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL; // Dynamically use the base URL
  const [destructuredValues, setDestructuredValues] = useState({ functionName: null, params: [] });

  // Extracting functionName and parameters dynamically from the input
  useEffect(() => {
    if (!functionName) return;

    const match = functionName.match(/\(([^)]+)\)/); // Get content inside parentheses
    if (match) {
      const params = match[1].split(',').map(param => param.trim()); // Split into array of parameters
      const pureFunctionName = functionName.split('(')[0]; // Extract function name before '('
      setDestructuredValues({ functionName: pureFunctionName, params });
    }
  }, [functionName]);

  // Fetching data based on function name and dynamic parameters
  useEffect(() => {
    if (!destructuredValues.functionName || destructuredValues.params.length === 0) return;

    const intervalId = setInterval(() => {
      // Dynamically construct the URL by removing the static part and appending function name and parameters
      const dynamicURL = `${BASE_URL}/testing/${destructuredValues.functionName}/${destructuredValues.params.join('/')}`;
        
      axios.get(dynamicURL).then((res) => {
       
           console.log("text",res)
           setData(res.data.result)
        // Map colors or any other styling options
       
      }).catch(error => {
        console.error("Error fetching chart data:", error);
      });
    }, 1000); // 1000ms = 1 second interval for live updates

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [destructuredValues]);

  return (
    <div className="p-6">
      <textarea
                  className="border p-2 w-full h-full resize-none"
                  placeholder="Write something here..."
                  value={Data}
                //   onChange={(e) => updateTextbox(index, e.target.value)}
                />
    </div>
  );
}

export default Textbox;
