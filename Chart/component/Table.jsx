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

function Table({ functionName }) {
  const [Data, setData] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL; 
  const [destructuredValues, setDestructuredValues] = useState({ functionName: null, params: [] });

  
  useEffect(() => {
    if (!functionName) return;

    const match = functionName.match(/\(([^)]+)\)/); 
    if (match) {
      const params = match[1].split(',').map(param => param.trim()); 
      const pureFunctionName = functionName.split('(')[0];
      setDestructuredValues({ functionName: pureFunctionName, params });
    }
  }, [functionName]);

 
  useEffect(() => {
    if (!destructuredValues.functionName || destructuredValues.params.length === 0) return;

    const intervalId = setInterval(() => {
    
      const dynamicURL = `${BASE_URL}/testing/${destructuredValues.functionName}/${destructuredValues.params.join('/')}`;
        
      axios.get(dynamicURL).then((res) => {
       
          
           setData(res.data.result)
        
       
      }).catch(error => {
        console.error("Error fetching chart data:", error);
      });
    }, 1000); 

    return () => clearInterval(intervalId); 
  }, [destructuredValues]);

  return (
    <div className="p-6 overflow-x-auto">
      {Data ? (
        <div
          className=" p-4 bg-white rounded-md"
          dangerouslySetInnerHTML={{ __html: Data }}
        />
      ) : (
        <p>Loading table data...</p>
      )}
    </div>
  );
  
}

export default Table;
