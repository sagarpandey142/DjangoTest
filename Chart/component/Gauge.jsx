import React, { useState } from "react";
import {
  Bar,
  Line,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
  Scatter,
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
import { IoSettingsOutline } from "react-icons/io5";
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

const Speedometer = () => {
  const [barDataValues, setBarDataValues] = useState([10, 20, 30]);
  const [lineDataValues, setLineDataValues] = useState([15, 25, 35]);
  const [doughnutDataValues, setDoughnutDataValues] = useState([5, 15, 25]);
  const [radarDataValues, setRadarDataValues] = useState([40, 50, 60]);
  const [polarDataValues, setPolarDataValues] = useState([20, 30, 40]);
  const [bubbleDataValues, setBubbleDataValues] = useState([
    { x: 5, y: 10, r: 10 },
    { x: 15, y: 25, r: 15 },
    { x: 25, y: 35, r: 20 },
  ]);
  const [scatterDataValues, setScatterDataValues] = useState([
    { x: 5, y: 10 },
    { x: 15, y: 25 },
    { x: 25, y: 35 },
  ]);

  // Modal state
  const [selectedChart, setSelectedChart] = useState(null);

  // Handle input change
  const handleInputChange = (event, setData) => {
    const values = event.target.value.split(",").map(Number);
    setData(values);
  };

  // Open modal with selected chart
  const openModal = (chart) => {
    setSelectedChart(chart);
  };

  // Close modal
  const closeModal = () => {
    setSelectedChart(null);
  };

  const chartStyle = {
    border: "2px solid black",
    padding: "50px",
    margin: "10px",
    borderRadius: "10px",
    width: "400px",
    height: "400px",
    textAlign: "center",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      <div style={chartStyle} >
        <IoSettingsOutline onClick={() => openModal("bar")} style={{ display: "flex", justifyContent: "flex-end",width:"650px" }}/>
        <input type="text" placeholder="Enter values" onChange={(e) => handleInputChange(e, setBarDataValues)} />
        <Bar data={{ labels: ["Red", "Blue", "Yellow"], datasets: [{ label: "Bar Chart", data: barDataValues, backgroundColor: ["red", "blue", "yellow"] }] }} />
      </div>

      <div style={chartStyle} >
      <IoSettingsOutline onClick={() => openModal("line")}  style={{ display: "flex", justifyContent: "flex-end",width:"650px" }}/>
        <input type="text" placeholder="Enter values" onChange={(e) => handleInputChange(e, setLineDataValues)} />
        <Line data={{ labels: ["Jan", "Feb", "Mar"], datasets: [{ label: "Line Chart", data: lineDataValues, borderColor: "green", fill: false }] }} />
      </div>

      <div style={chartStyle}>
      <IoSettingsOutline onClick={() => openModal("doughnut")}  style={{ display: "flex", justifyContent: "flex-end",width:"650px" }}/>
        <input type="text" placeholder="Enter values" onChange={(e) => handleInputChange(e, setDoughnutDataValues)} />
        <Doughnut data={{ labels: ["Chrome", "Firefox", "Safari"], datasets: [{ label: "Doughnut Chart", data: doughnutDataValues, backgroundColor: ["#4285F4", "#FF7139", "#FFD43B"] }] }} />
      </div>

      <div style={chartStyle} >
      <IoSettingsOutline onClick={() => openModal("radar")}  style={{ display: "flex", justifyContent: "flex-end",width:"650px" }}/>
        <input type="text" placeholder="Enter values" onChange={(e) => handleInputChange(e, setRadarDataValues)} />
        <Radar data={{ labels: ["Running", "Swimming", "Cycling"], datasets: [{ label: "Radar Chart", data: radarDataValues, backgroundColor: "rgba(255,99,132,0.2)", borderColor: "red" }] }} />
      </div>

      <div style={chartStyle} >
      <IoSettingsOutline onClick={() => openModal("polar")}  style={{ display: "flex", justifyContent: "flex-end",width:"650px" }}/>
        <input type="text" placeholder="Enter values" onChange={(e) => handleInputChange(e, setPolarDataValues)} />
        <PolarArea data={{ labels: ["A", "B", "C"], datasets: [{ label: "Polar Area Chart", data: polarDataValues, backgroundColor: ["purple", "cyan", "pink"] }] }} />
      </div>

      {/* Graph 5: Bubble Chart */}
      <div style={chartStyle} >
      <IoSettingsOutline onClick={() => openModal("bubble")}  style={{ display: "flex", justifyContent: "flex-end",width:"650px" }}/>
        <Bubble data={{ datasets: [{ label: "Bubble Chart", data: bubbleDataValues, backgroundColor: "blue" }] }} />
      </div>

     

      {/* Modal */}
      {selectedChart && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
          onClick={closeModal}
        >
          <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            width: "70%",
            height: "70%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "red",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }} onClick={closeModal}>Close</button>

            {selectedChart === "bar" && <Bar data={{ labels: ["Red", "Blue", "Yellow"], datasets: [{ label: "Bar Chart", data: barDataValues, backgroundColor: ["red", "blue", "yellow"] }] }} />}
            {selectedChart === "line" && <Line data={{ labels: ["Jan", "Feb", "Mar"], datasets: [{ label: "Line Chart", data: lineDataValues, borderColor: "green", fill: false }] }} />}
            {selectedChart === "doughnut" && <Doughnut data={{ labels: ["Chrome", "Firefox", "Safari"], datasets: [{ label: "Doughnut Chart", data: doughnutDataValues, backgroundColor: ["#4285F4", "#FF7139", "#FFD43B"] }] }} />}
            {selectedChart === "radar" && <Radar data={{ labels: ["Running", "Swimming", "Cycling"], datasets: [{ label: "Radar Chart", data: radarDataValues, backgroundColor: "rgba(255,99,132,0.2)", borderColor: "red" }] }} />}
            {selectedChart === "polar" && <PolarArea data={{ labels: ["A", "B", "C"], datasets: [{ label: "Polar Area Chart", data: polarDataValues, backgroundColor: ["purple", "cyan", "pink"] }] }} />}
            {selectedChart === "bubble" && <Bubble data={{ datasets: [{ label: "Bubble Chart", data: bubbleDataValues, backgroundColor: "blue" }] }} />}
           
          </div>
        </div>
      )}
    </div>
  );
};

export default Speedometer;
