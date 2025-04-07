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
import { v4 as uuidv4 } from 'uuid';

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
const userId = 13;

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
      const res = await axios.get(`${BASE_URL}/layout/${userId}`);
      return res.data?.charts?.items || [];
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  const saveCharts = async (charts) => {
    try {
      const payload = {
        charts: { items: charts },
        data: {},
        table_values: {},
      };
      await axios.post(`${BASE_URL}/layout/${userId}`, payload);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const addChart = () => {
    const groupId = uuidv4();
    const newItems = [
      { type: '', data: { labels: [], values: [] }, size: 'bigger', groupId },
      { type: 'textbox', data: { text: '' }, size: 'bigger', groupId },
      { type: 'table', data: { rows: [['', ''], ['', '']] }, size: 'bigger', groupId },
    ];
    const updated = [...charts, ...newItems];
    setCharts(updated);
    saveCharts(updated);
  };

  const removeChartGroup = (groupId) => {
    const updated = charts.filter(chart => chart.groupId !== groupId);
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

  const updateTextbox = (index, value) => {
    const updated = [...charts];
    updated[index].data.text = value;
    setCharts(updated);
    saveCharts(updated);
  };

  const updateTableCell = (index, rowIndex, colIndex, value) => {
    const updated = [...charts];
    updated[index].data.rows[rowIndex][colIndex] = value;
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
        layout={charts.map((chart, i) => ({
          i: i.toString(),
          x: (i * 2) % 12,
          y: Infinity,
          w: chart.size === 'bigger' ? 6 : 4,
          h: chart.type === 'textbox' ? 5 : 8,
        }))}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        {charts.map((chart, index) => {
          const isFirstInGroup = charts.findIndex(c => c.groupId === chart.groupId) === index;

          return (
            <div
              key={index.toString()}
              className="border-2 border-black p-4 rounded-lg relative bg-white overflow-hidden"
            >
              {/* Delete button only on first of group */}
              {isFirstInGroup && (
                <button
                  className="absolute top-2 right-2 text-red-500 z-50 bg-white p-1 rounded-full shadow"
                  style={{ pointerEvents: 'auto' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    removeChartGroup(chart.groupId);
                  }}
                >
                  <FaTrash />
                </button>
              )}

              {/* Chart Card */}
              {chart.type === '' && (
                <select
                  onChange={(e) => selectChartType(index, e.target.value)}
                  className="border p-2 rounded w-full mb-2"
                >
                  <option value="">Select Chart Type</option>
                  {chartTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              )}

              {chartTypes.includes(chart.type) && (
                <>
                  <input
                    className="border p-2 w-full mb-2"
                    type="text"
                    placeholder="Labels (comma-separated)"
                    value={chart.data.labels?.join(',') || ''}
                    onChange={(e) => updateChartData(index, 'labels', e.target.value)}
                  />
                  <input
                    className="border p-2 w-full mb-2"
                    type="text"
                    placeholder="Values (comma-separated)"
                    value={chart.data.values?.join(',') || ''}
                    onChange={(e) => updateChartData(index, 'values', e.target.value)}
                  />
                  <div className="w-full flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full">
                      {chart.type === 'bar' && <Bar data={getChartData(chart)} />}
                      {chart.type === 'line' && <Line data={getChartData(chart)} />}
                      {chart.type === 'doughnut' && <Doughnut data={getChartData(chart)} />}
                      {chart.type === 'radar' && <Radar data={getChartData(chart)} />}
                      {chart.type === 'polar' && <PolarArea data={getChartData(chart)} />}
                      {chart.type === 'bubble' && <Bubble data={getChartData(chart)} />}
                      {chart.type === 'pie' && <Pie data={getChartData(chart)} />}
                    </div>
                  </div>
                </>
              )}

              {/* Textbox */}
              {chart.type === 'textbox' && (
                <textarea
                  className="border p-2 w-full h-full resize-none"
                  placeholder="Write something here..."
                  value={chart.data.text}
                  onChange={(e) => updateTextbox(index, e.target.value)}
                />
              )}

              {/* Table */}
              {chart.type === 'table' && (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-400">
                    <tbody>
                      {chart.data.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td key={colIndex} className="border border-gray-400">
                              <input
                                type="text"
                                className="p-2 w-full"
                                value={cell}
                                onChange={(e) =>
                                  updateTableCell(index, rowIndex, colIndex, e.target.value)
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </GridLayout>

      <button onClick={addChart} className="bg-blue-500 text-white px-4 py-2 rounded flex mt-4">
        <FaPlus className="mr-2" /> Add Chart
      </button>
    </div>
  );
};

export default ChartDashboard;
