// import React from 'react';
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

// const DATA_COUNT = 12;
// const labels = [];
// for (let i = 0; i < DATA_COUNT; ++i) {
//   labels.push(i.toString());
// }
// const datapoints = [0, 20, 20, 60, 60, 120, NaN, 180, 120, 125, 105, 110, 170];
// const data = {
//   labels: labels,
//   datasets: [
//     {
//       label: 'Cubic interpolation (monotone)',
//       data: datapoints,
//       borderColor: 'red',
//       fill: false,
//       cubicInterpolationMode: 'monotone',
//       tension: 0.4
//     }, {
//       label: 'Cubic interpolation',
//       data: datapoints,
//       borderColor: 'blue',
//       fill: false,
//       tension: 0.4
//     }, {
//       label: 'Linear interpolation (default)',
//       data: datapoints,
//       borderColor: 'green',
//       fill: false
//     }
//   ]
// };

// const Dashboard = () => {
//   const chartStyle = {
//     border: '2px solid black',
//     padding: '10px',
//     margin: '10px',
//     borderRadius: '10px',
//     width: '400px',
//     height: '400px'
//   };

//   const barData = {
//     labels: ['Red', 'Blue', 'Yellow'],
//     datasets: [{ label: 'Bar Chart', data: [12, 19, 3], backgroundColor: ['red', 'blue', 'yellow'] }]
//   };

//   const lineData = {
//     labels: ['Jan', 'Feb', 'Mar'],
//     datasets: [{ label: 'Line Chart', data: [3, 7, 4], borderColor: 'green', fill: false }]
//   };

//   const pieData = {
//     labels: ['Apple', 'Orange', 'Banana'],
//     datasets: [{ label: 'Pie Chart', data: [10, 20, 30], backgroundColor: ['red', 'orange', 'yellow'] }]
//   };

//   const doughnutData = {
//     labels: ['Chrome', 'Firefox', 'Safari'],
//     datasets: [{ label: 'Doughnut Chart', data: [40, 25, 35], backgroundColor: ['#4285F4', '#FF7139', '#FFD43B'] }]
//   };

//   const radarData = {
//     labels: ['Running', 'Swimming', 'Cycling'],
//     datasets: [{ label: 'Radar Chart', data: [5, 10, 8], backgroundColor: 'rgba(255,99,132,0.2)', borderColor: 'red' }]
//   };

//   const polarData = {
//     labels: ['A', 'B', 'C'],
//     datasets: [{ label: 'Polar Area Chart', data: [11, 16, 7], backgroundColor: ['purple', 'cyan', 'pink'] }]
//   };

//   return (
//     <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
//       <div style={chartStyle}>
//       <Line data={data} /></div>
//       <div style={chartStyle}><Bar data={barData} /></div>
//       <div style={chartStyle}><Line data={lineData} /></div>
//       <div style={chartStyle}><Pie data={pieData} /></div>
//       <div style={chartStyle}><Doughnut data={doughnutData} /></div>
//       <div style={chartStyle}><Radar data={radarData} /></div>
      
//     </div>
//   );
// };

// export default Dashboard;
