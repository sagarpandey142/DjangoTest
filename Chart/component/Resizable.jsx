// import React, { useState } from 'react';
// import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement, RadialLinearScale } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   RadialLinearScale,
//   Title,
//   Tooltip,
//   Legend
// );

// const generateRandomData = (count) => Array.from({ length: count }, () => Math.floor(Math.random() * 100));

// const Dashboard = () => {
//   const [barDataValues, setBarDataValues] = useState(generateRandomData(3));
//   const [lineDataValues, setLineDataValues] = useState(generateRandomData(3));
//   const [pieDataValues, setPieDataValues] = useState(generateRandomData(3));
//   const [doughnutDataValues, setDoughnutDataValues] = useState(generateRandomData(3));
//   const [radarDataValues, setRadarDataValues] = useState(generateRandomData(3));
//   const [polarDataValues, setPolarDataValues] = useState(generateRandomData(3));

//   const handleInputChange = (event, setData) => {
//     const values = event.target.value.split(',').map(Number);
//     setData(values);
//   };

//   const chartStyle = {
//     border: '2px solid black',
//     padding: '25px',
//     margin: '10px',
//     borderRadius: '10px',
//     width: '400px',
//     height: '400px',
//     textAlign: 'center',
//   };

//   // Speedometer State
//   const [value, setValue] = useState(50); // Default speed value

//   // Define colors for different ranges
//   const COLORS = ["rgb(140, 214, 16)", "rgb(239, 198, 0)", "rgb(231, 24, 49)"];

//   // Determine color based on value
//   const getColor = (val) => (val < 40 ? COLORS[0] : val < 80 ? COLORS[1] : COLORS[2]);

//   // Chart data for speedometer
//   const speedometerData = {
//     datasets: [
//       {
//         data: [value, 100 - value],
//         backgroundColor: [getColor(value), "rgba(200,200,200,0.3)"],
//         borderWidth: 0,
//         cutout: "75%",
//         circumference: 180,
//         rotation: -90,
//       },
//     ],
//   };

//   // Custom plugin to add text in the center
//   const textCenterPlugin = {
//     id: "textCenter",
//     beforeDraw: (chart) => {
//       const { ctx, chartArea } = chart;
//       ctx.save();
//       ctx.font = "bold 22px Arial";
//       ctx.fillStyle = getColor(value);
//       ctx.textAlign = "center";
//       ctx.fillText(`${value}%`, chartArea.width / 2, chartArea.height / 1.3);
//       ctx.font = "14px Arial";
//       ctx.fillStyle = "gray";
//       ctx.fillText("CPU Utilization", chartArea.width / 2, chartArea.height / 1.1);
//       ctx.restore();
//     },
//   };

//   return (
//     <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
//       <div style={chartStyle}>
//         <input type="text" placeholder="Enter values" onChange={(e) => handleInputChange(e, setBarDataValues)} />
//         <Bar data={{ labels: ['Red', 'Blue', 'Yellow'], datasets: [{ label: 'Bar Chart', data: barDataValues, backgroundColor: ['red', 'blue', 'yellow'] }] }} />
//       </div>
//       <div style={chartStyle}>
//         <input type="text" placeholder="Enter values" onChange={(e) => handleInputChange(e, setLineDataValues)} />
//         <Line data={{ labels: ['Jan', 'Feb', 'Mar'], datasets: [{ label: 'Line Chart', data: lineDataValues, borderColor: 'green', fill: false }] }} />
//       </div>

//       {/* Speedometer Chart */}
//       <div style={chartStyle}>
//         <input 
//           type="number" 
//           value={value} 
//           onChange={(e) => setValue(Number(e.target.value))} 
//           style={{ marginBottom: "10px", textAlign: "center", padding: "5px" }} 
//         />
//         <Doughnut data={speedometerData} options={{ responsive: true, maintainAspectRatio: false }} plugins={[textCenterPlugin]} />
//       </div>

//       <div style={chartStyle}>
//         <input type="text" placeholder="Enter values" onChange={(e) => handleInputChange(e, setDoughnutDataValues)} />
//         <Doughnut data={{ labels: ['Chrome', 'Firefox', 'Safari'], datasets: [{ label: 'Doughnut Chart', data: doughnutDataValues, backgroundColor: ['#4285F4', '#FF7139', '#FFD43B'] }] }} />
//       </div>
//       <div style={chartStyle}>
//         <input type="text" placeholder="Enter values" onChange={(e) => handleInputChange(e, setRadarDataValues)} />
//         <Radar data={{ labels: ['Running', 'Swimming', 'Cycling'], datasets: [{ label: 'Radar Chart', data: radarDataValues, backgroundColor: 'rgba(255,99,132,0.2)', borderColor: 'red' }] }} />
//       </div>
//       <div style={chartStyle}>
//         <input type="text" placeholder="Enter values" onChange={(e) => handleInputChange(e, setPolarDataValues)} />
//         <PolarArea data={{ labels: ['A', 'B', 'C'], datasets: [{ label: 'Polar Area Chart', data: polarDataValues, backgroundColor: ['purple', 'cyan', 'pink'] }] }} />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
