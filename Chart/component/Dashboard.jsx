import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import {
  Bar, Line, Doughnut, Radar, PolarArea, Bubble, Pie,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaPlus, FaTrash } from 'react-icons/fa';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

const chartTypes = ['bar', 'line', 'doughnut', 'radar', 'polar', 'bubble', 'pie'];
const BASE_URL = "http://localhost:5000";
const userId = 2;

const ChartDashboard = () => {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    const loadCharts = async () => {
      const saved = await fetchCharts(userId);
      setCharts(saved);
    };
    loadCharts();
  }, []);

  const fetchCharts = async (userId) => {
    try {
      const res = await axios.get(`${BASE_URL}/charts/${userId}`);
      return res.data?.charts || [];
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  const saveCharts = async (charts) => {
    try {
      await axios.post(`${BASE_URL}/charts/${userId}`, { charts });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const addChart = () => {
    const updated = [...charts, { type: '', data: { labels: [], values: [] }, size: 'bigger' }];
    setCharts(updated);
    saveCharts(updated);
  };

  const removeChart = (index) => {
    console.log("indexx",index)
    const updated = charts.filter((_, i) => i !== index);
    setCharts(updated);
    saveCharts(updated);
  };

  const selectChartType = (index, type) => {
    const updated = [...charts];
    updated[index].type = type;
    setCharts(updated);
    saveCharts(updated);
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
    saveCharts(updated);
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
                <div className="w-full flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full">
                    {chart.type === 'bar' && <Bar key={`bar-${index}`} data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'line' && <Line key={`line-${index}`} data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'doughnut' && <Doughnut key={`doughnut-${index}`} data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'radar' && <Radar key={`radar-${index}`} data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'polar' && <PolarArea key={`polar-${index}`} data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'bubble' && <Bubble key={`bubble-${index}`} data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
                    {chart.type === 'pie' && <Pie key={`pie-${index}`} data={getChartData(chart)} options={{ maintainAspectRatio: false, responsive: true }} />}
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
