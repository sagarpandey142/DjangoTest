import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import {
  Bar, Line, Doughnut, Radar, PolarArea, Bubble, Pie,
} from 'react-chartjs-2';
import { FaPlus } from 'react-icons/fa';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const chartTypes = ['bar', 'line', 'doughnut', 'radar', 'polar', 'bubble', 'pie'];

const ChartDashboard = () => {
  const [charts, setCharts] = useState([]);

  const addChart = () => {
    const defaultData = {
      type: '',
      data: {
        labels: ['Jan', 'Feb', 'Mar'],
        values: [10, 20, 30],
      },
    };
    setCharts([...charts, defaultData]);
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

  const layout = [];
  charts.forEach((_, i) => {
    layout.push(
      { i: `${i}-title`, x: 0, y: i * 3, w: 12, h: 1 },
      { i: `${i}-form`, x: 0, y: i * 3 + 1, w: 12, h: 2 },
      { i: `${i}-chart`, x: 0, y: i * 3 + 2, w: 12, h: 6 }
    );
  });

  return (
    <div className="p-4">
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
      {charts.map((chart, index) => (
  <React.Fragment key={index}>
    {/* Title Card */}
    <div key={`${index}-title`} className="border-2 border-black p-2 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold">Chart {index + 1}</h2>
    </div>

    {/* Form Card */}
    <div key={`${index}-form`} className="border p-4 rounded bg-white">
      <select
        onChange={(e) => selectChartType(index, e.target.value)}
        value={chart.type}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Select Chart Type</option>
        {chartTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Labels (comma-separated)"
        value={chart.data.labels.join(',')}
        onChange={(e) => updateChartData(index, 'labels', e.target.value)}
      />
      <input
        className="border p-2 w-full"
        type="text"
        placeholder="Values (comma-separated)"
        value={chart.data.values.join(',')}
        onChange={(e) => updateChartData(index, 'values', e.target.value)}
      />
    </div>

    {/* Chart Display Card */}
    <div key={`${index}-chart`} className="border p-4 rounded bg-white overflow-hidden">
  {chart.type === 'bar' && <Bar key={`bar-${index}`} data={getChartData(chart)} options={{ responsive: true, maintainAspectRatio: false }} />}
  {chart.type === 'line' && <Line key={`line-${index}`} data={getChartData(chart)} options={{ responsive: true, maintainAspectRatio: false }} />}
  {chart.type === 'doughnut' && <Doughnut key={`doughnut-${index}`} data={getChartData(chart)} options={{ responsive: true, maintainAspectRatio: false }} />}
  {chart.type === 'radar' && <Radar key={`radar-${index}`} data={getChartData(chart)} options={{ responsive: true, maintainAspectRatio: false }} />}
  {chart.type === 'polar' && <PolarArea key={`polar-${index}`} data={getChartData(chart)} options={{ responsive: true, maintainAspectRatio: false }} />}
  {chart.type === 'bubble' && <Bubble key={`bubble-${index}`} data={getChartData(chart)} options={{ responsive: true, maintainAspectRatio: false }} />}
  {chart.type === 'pie' && <Pie key={`pie-${index}`} data={getChartData(chart)} options={{ responsive: true, maintainAspectRatio: false }} />}
</div>

  </React.Fragment>
))}

      </GridLayout>

      <button onClick={addChart} className="bg-blue-500 text-white px-4 py-2 rounded flex mt-4">
        <FaPlus className="mr-2" /> Add Chart
      </button>
    </div>
  );
};

export default ChartDashboard;
