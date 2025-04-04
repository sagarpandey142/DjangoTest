import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import {
  Bar, Line, Doughnut, Radar, PolarArea, Bubble, Pie,
} from 'react-chartjs-2';
import { CiCircleMinus } from 'react-icons/ci';
import { FaCog, FaPlus } from 'react-icons/fa';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const chartTypes = ['bar', 'line', 'doughnut', 'radar', 'polar', 'bubble', 'pie'];

const ChartDashboard = () => {
  const [charts, setCharts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const addChart = () => {
    setCharts([...charts, { type: '', data: { labels: [], values: [] } }]);
  };

  const removeChart = (index) => {
    console.log("index",index)
    const updated = [...charts];
    updated.splice(index, 1);
    setCharts(updated);
    setOpenDropdown(null);
  };

  const selectChartType = (index, type) => {
    const updated = [...charts];
    updated[index].type = type;
    setCharts(updated);
  };

  const updateChartData = (index, field, value) => {
    const updated = [...charts];
    const values = value.split(',').map((item) => item.trim());

    if (field === 'labels') {
      updated[index].data.labels = values;
    } else if (field === 'values') {
      updated[index].data.values = values.map(Number);
    }

    setCharts(updated);
  };

  const updateLayout = (index, sizeType) => {
    const updated = [...charts];
    updated[index].size = sizeType;
    setCharts(updated);
  };

  const getChartData = (chart) => ({
    labels: chart.data.labels,
    datasets: [
      {
        label: 'Dataset',
        data: chart.data.values,
        backgroundColor: [
          '#4dc9f6', '#f67019', '#f53794',
          '#537bc4', '#acc236', '#166a8f', '#00a950',
        ],
      },
    ],
  });

  return (
    <div className="p-4">
      <GridLayout
      
        className="layout"
        layout={charts.map((_, i) => ({
          i: i.toString(),
          x: (i * 2) % 12,
          y: Infinity,
         
          w: charts[i]?.size === 'bigger' ? 6 : 4,
          h: charts[i]?.size === 'bigger' ? 7 : 8,
        }))}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        {charts.map((chart, index) => (
          <div
            key={index.toString()}
            className="border-2 border-black p-4 rounded-lg relative bg-white overflow-hidden"
          >
           
            {/* <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
            >
              <FaCog size={20} />
            </button> */}

           
            {openDropdown === index && (
              <div className="absolute right-0 bg-white shadow-lg border rounded mt-2 z-10 p-2">
                <button
                  onClick={() => updateLayout(index, 'smaller')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  layout 1 (smaller)
                </button>
                <button
                  onClick={() => updateLayout(index, 'bigger')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  layout 2 (bigger)
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
                  value={charts[index]?.data.labels?.join(',') || ''}
                  onChange={(e) => updateChartData(index, 'labels', e.target.value)}
                />
                <input
                  className="border p-2 w-full mb-2"
                  type="text"
                  placeholder="Values (comma-separated)"
                  value={charts[index]?.data.values?.join(',') || ''}
                  onChange={(e) => updateChartData(index, 'values', e.target.value)}
                />

              
                <div className="w-full  flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full">
                    {chart.type === 'bar' && <Bar data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'line' && <Line data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'doughnut' && <Doughnut data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'radar' && <Radar data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'polar' && <PolarArea data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'bubble' && <Bubble data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'pie' && <Pie data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </GridLayout>

     
      <button onClick={addChart} className="bg-blue-500 text-white px-4 py-2 rounded flex mt-4">
        <FaPlus className="mr-2" /> Add Chart
      </button>
    </div>
  );
};

export default ChartDashboard;
