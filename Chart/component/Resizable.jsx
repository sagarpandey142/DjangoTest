import React, { useState } from "react";
import {
  Bar,
  Line,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaPlus } from "react-icons/fa";
import { IoSettingsOutline, IoAddCircleOutline } from "react-icons/io5";
import { CiCircleMinus } from "react-icons/ci";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const chartTypes = ["bar", "line", "doughnut", "radar", "polar", "bubble"];

const getRandomValues = (type) => {
  if (type === "bubble") {
    return [
      { x: Math.random() * 10, y: Math.random() * 10, r: Math.random() * 10 },
      { x: Math.random() * 20, y: Math.random() * 20, r: Math.random() * 15 },
      { x: Math.random() * 30, y: Math.random() * 30, r: Math.random() * 20 },
    ];
  }
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * 50) + 10);
};

const Dashboard = () => {
  const [charts, setCharts] = useState([{ type: null, layout: null }]);
  const [chartData, setChartData] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [dropdownIndex, setDropdownIndex] = useState(null);

  const addChart = () => {
    setCharts([...charts, { type: null, layout: null }]);
  };

  const removeChart = (index) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this chart?");
    if (isConfirmed) {
      setCharts(charts.filter((_, i) => i !== index));
    }
  };
  

  const selectChartType = (index, type) => {
    const updatedCharts = [...charts];
    updatedCharts[index].type = type;
    setCharts(updatedCharts);
  };

  const selectLayout = (index, layout) => {
    const updatedCharts = [...charts];
    updatedCharts[index].layout = layout;
    setCharts(updatedCharts);
    setChartData({ ...chartData, [index]: getRandomValues(updatedCharts[index].type) });
    setDropdownIndex(null); // Close dropdown after selection
  };

  const toggleDropdown = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const handleInputChange = (event, index) => {
    const value = event.target.value;
    setInputValues({ ...inputValues, [index]: value });
    setChartData({ ...chartData, [index]: value.split(",").map(Number) });
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", overflow: "hidden" }}>
      {charts.map((chart, index) => (
        <div
          key={index}
          style={{
            border: "2px solid black",
            padding: "20px",
            margin: "10px",
            borderRadius: "10px",
            width: chart.layout === "bigger" ? "600px" : "450px",
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <button onClick={() => removeChart(index)} style={{ position: "absolute", top: 10, right: 10 }}>
                <CiCircleMinus />
              </button>
          {!chart.type ? (
            <select onChange={(e) => selectChartType(index, e.target.value)}>
              <option value="">Select Chart Type</option>
              {chartTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          ) : !chart.layout ? (
            <select onChange={(e) => selectLayout(index, e.target.value)}>
              <option value="">Select Layout</option>
              <option value="small">Layout 1 (Small)</option>
              <option value="bigger">Layout 2 (Bigger)</option>
            </select>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter values"
                value={inputValues[index] || ""}
                onChange={(e) => handleInputChange(e, index)}
                style={{ marginBottom: "10px" }}
              />
              {chart.type === "bar" && <Bar data={{ labels: ["A", "B", "C"], datasets: [{ data: chartData[index] || [], backgroundColor: ["red", "blue", "yellow"] }] }} />}
              {chart.type === "line" && <Line data={{ labels: ["Jan", "Feb", "Mar"], datasets: [{ data: chartData[index] || [], borderColor: "green" }] }} />}
              {chart.type === "doughnut" && <Doughnut data={{ labels: ["X", "Y", "Z"], datasets: [{ data: chartData[index] || [], backgroundColor: ["#4285F4", "#FF7139", "#FFD43B"] }] }} />}
              {chart.type === "radar" && <Radar data={{ labels: ["Run", "Swim", "Cycle"], datasets: [{ data: chartData[index] || [], borderColor: "red" }] }} />}
              {chart.type === "polar" && <PolarArea data={{ labels: ["One", "Two", "Three"], datasets: [{ data: chartData[index] || [], backgroundColor: ["purple", "cyan", "pink"] }] }} />}
              {chart.type === "bubble" && <Bubble data={{ datasets: [{ data: chartData[index] || [], backgroundColor: "blue" }] }} />}

              {/* Buttons */}
              <button onClick={() => removeChart(index)} style={{ position: "absolute", top: 10, right: 10 }}>
                <CiCircleMinus />
              </button>
              <button onClick={() => toggleDropdown(index)} style={{ position: "absolute", top: 10, right: 40 }}>
                <IoSettingsOutline />
              </button>

              {/* Dropdown */}
              {dropdownIndex === index && (
                <div style={{
                  position: "absolute",
                  top: "40px",
                  right: "10px",
                  background: "white",
                  border: "1px solid black",
                  padding: "10px",
                  borderRadius: "5px",
                  zIndex: 10
                }}>
                  <p style={{ margin: 0, fontWeight: "bold" }}>Select Layout</p>
                  <button onClick={() => selectLayout(index, "small")} style={{ display: "block", marginTop: "5px" }}>Layout 1 (Small)</button>
                  <button onClick={() => selectLayout(index, "bigger")} style={{ display: "block", marginTop: "5px" }}>Layout 2 (Bigger)</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
      <button onClick={addChart} style={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "flex-end", padding: "2rem", marginTop: "17rem" }}>
       <FaPlus/>
      </button>
    </div>
  );
};

export default Dashboard;
