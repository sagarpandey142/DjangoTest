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
import { IoSettingsOutline, IoAddCircleOutline } from "react-icons/io5";

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
  const [charts, setCharts] = useState(Array(6).fill(null));
  const [chartData, setChartData] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [chartSelection, setChartSelection] = useState({ index: null, type: null });

  const selectChartType = (index, type) => {
    setChartSelection({ index, type });
  };

  const selectLayout = (layout) => {
    if (chartSelection.index === null || !chartSelection.type) return;
    const updatedCharts = [...charts];
    updatedCharts[chartSelection.index] = { type: chartSelection.type, layout };
    setCharts(updatedCharts);
    setChartData({ ...chartData, [chartSelection.index]: getRandomValues(chartSelection.type) });
    setChartSelection({ index: null, type: null });
  };

  const changeLayout = (index, newLayout) => {
    const updatedCharts = [...charts];
    updatedCharts[index].layout = newLayout;
    setCharts(updatedCharts);
    setDropdownIndex(null);
  };

  const handleInputChange = (event, index) => {
    const value = event.target.value;
    setInputValues({ ...inputValues, [index]: value });
    setChartData({ ...chartData, [index]: value.split(",").map(Number) });
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {charts.map((chart, index) => (
        <div
          key={index}
          style={{
            border: "2px solid black",
            padding: "20px",
            margin: "10px",
            borderRadius: "10px",
            width: chart?.layout === "bigger" ? "600px" : "450px",
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {!chart ? (
            chartSelection.index === index ? (
              <div>
                <select onChange={(e) => selectLayout(e.target.value)}>
                  <option value="">Select Layout</option>
                  <option value="small">Layout 1 (Small)</option>
                  <option value="bigger">Layout 2 (Bigger)</option>
                </select>
              </div>
            ) : (
              <div>
                <select onChange={(e) => selectChartType(index, e.target.value)}>
                  <option value="">Select Chart Type</option>
                  {chartTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )
          ) : (
            <>
              <div style={{ position: "absolute", top: 10, right: 10 }}>
                <IoSettingsOutline
                  onClick={() => setDropdownIndex(index)}
                  style={{ cursor: "pointer" }}
                />
                {dropdownIndex === index && (
                  <div style={{
                    position: "absolute",
                    right: 0,
                    background: "white",
                    border: "1px solid black",
                    borderRadius: "5px",
                    padding: "10px",
                    width:"100px",
                    zIndex: 10,
                  }}>
                    <div style={{ cursor: "pointer", padding: "5px" }} onClick={() => changeLayout(index, "small")}>
                      Layout 1 (Small)
                    </div>
                    <div style={{ cursor: "pointer", padding: "5px" }} onClick={() => changeLayout(index, "bigger")}>
                      Layout 2 (Bigger)
                    </div>
                  </div>
                )}
              </div>
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;