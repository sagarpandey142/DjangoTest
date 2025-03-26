import React, { useState, useEffect } from "react";
import { Bar, Line, Doughnut, Radar, PolarArea, Bubble, Pie } from "react-chartjs-2";
import axios from "axios";
import { FaPlus, FaCog } from "react-icons/fa";
import { CiCircleMinus, CiRollingSuitcase } from "react-icons/ci";

const chartTypes = ["bar", "line", "doughnut", "radar", "polar", "bubble", "pie"];

const Dashboard = () => {
  const [charts, setCharts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const userId = 1;

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/charts/${userId}`);
      console.log("data",response)
      setCharts(response.data.charts || []);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const updateBackend = async (updatedCharts) => {
    try {
      await axios.post(`http://localhost:5000/charts/${userId}`, { charts: updatedCharts });
    } catch (error) {
      console.error("Error updating chart data:", error);
    }
  };

  const addChart = () => {
    const newCharts = [...charts, { type: null, data: { labels: [], values: [] }, layout: "bigger" }];
    setCharts(newCharts);
    updateBackend(newCharts);
  };

  const removeChart = (index) => {
    if (window.confirm("Are you sure you want to delete this chart?")) {
      const newCharts = charts.filter((_, i) => i !== index);
      setCharts(newCharts);
      updateBackend(newCharts);
    }
  };

  const selectChartType = (index, type) => {
    const newCharts = [...charts];
    newCharts[index].type = type;
    setCharts(newCharts);
    updateBackend(newCharts);
  };

  const updateChartData = (index, field, value) => {
    const newCharts = [...charts];
    newCharts[index].data[field] = value.split(",");
    setCharts(newCharts);
    updateBackend(newCharts);
  };

  const updateLayout = (index, layout) => {
    
    const newCharts = [...charts];
    newCharts[index].layout = layout;
    setCharts(newCharts);
    updateBackend(newCharts);
  };

  const getChartData = (chart) => ({
    labels: chart.data.labels || [],
    datasets: [
      {
        data: chart.data.values?.map(Number) || [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  });

  return (
    <div className="flex flex-wrap p-4">
      {charts.map((chart, index) => (
        <div
          key={index}
          className="border-2 border-black p-4 m-4 rounded-lg relative"
          style={{ width: chart.layout === "smaller" ? "300px" : "500px" }}
            
        >
          <button onClick={() => removeChart(index)} className="text-red-500 mb-2">
            <CiCircleMinus size={20} />
          </button>
          <button
            className="absolute top-2 right-2 text-gray-500"
            onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
          >
            <FaCog size={20} />
          </button>
          {openDropdown === index && (
            <div className="absolute right-0 bg-white shadow-lg border rounded mt-2 z-10 p-2">
              <button
                onClick={() => updateLayout(index, "smaller")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                layout 1 ( smaller ) 
              </button>
              <button
                onClick={() => updateLayout(index, "bigger")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                layout 2  ( Bigger )
              </button>
            </div>
          )}
          {!chart.type ? (
            <select
              onChange={(e) => selectChartType(index, e.target.value)}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Select Chart Type</option>
              {chartTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          ) : (
            <>
              <input
                className="border p-2 w-full mb-2"
                type="text"
                placeholder="Labels (comma-separated)"
                onBlur={(e) => updateChartData(index, "labels", e.target.value)}
              />
              <input
                className="border p-2 w-full mb-2"
                type="text"
                placeholder="Values (comma-separated)"
                onBlur={(e) => updateChartData(index, "values", e.target.value)}
              />
              {chart.type === "bar" && <Bar data={getChartData(chart)} />} 
              {chart.type === "line" && <Line data={getChartData(chart)} />} 
              {chart.type === "doughnut" && <Doughnut data={getChartData(chart)} />} 
              {chart.type === "radar" && <Radar data={getChartData(chart)} />} 
              {chart.type === "polar" && <PolarArea data={getChartData(chart)} />} 
              {chart.type === "bubble" && <Bubble data={getChartData(chart)} />} 
              {chart.type === "pie" && <Pie data={getChartData(chart)} />} 
            </>
          )}
        </div>
      ))}
      <button onClick={addChart} className="bg-blue-500 text-white px-4 py-2 rounded flex h-fit ">
        <FaPlus className="mr-2" />
      </button>
    </div>
  );
};

export default Dashboard;