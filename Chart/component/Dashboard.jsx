import React, { useState, useEffect, useRef } from 'react';
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
import { FaPlus, FaTrash } from 'react-icons/fa'; // Delete icon added here
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import axios from 'axios';
import Test from "./Test";

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

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ChartDashboard = () => {
  const [charts, setCharts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [primaryType, setPrimaryType] = useState('');
  const [chartSubType, setChartSubType] = useState('');
  const [width, setWidth] = useState(1200);
  const containerRef = useRef(null);

  const primaryTypes = ['chart', 'textbox', 'table'];
  const chartSubTypes = ['bar', 'line', 'doughnut', 'radar', 'polar', 'bubble', 'pie'];

  const getUserId = () => {
    return localStorage.getItem('user_id') || 'guest';
  };

  useEffect(() => {
    const loadCharts = async () => {
      const uid = getUserId();
      const saved = await fetchCharts(uid);
      setCharts(saved);
    };
    loadCharts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      const userId = getUserId();
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

  const addChart = (type) => {
    const groupId = Date.now();
    let newItems = [];
    if (chartSubTypes.includes(type)) {
      newItems.push({ type, data: { labels: [], values: [] }, size: 'bigger', groupId, layout: {} });
    } else if (type === 'textbox') {
      newItems.push({ type, data: { text: '' }, size: 'bigger', groupId, layout: {} });
    } else if (type === 'table') {
      newItems.push({ type, data: { rows: [['', ''], ['', '']] }, size: 'bigger', groupId, layout: {} });
    }
    const updated = [...charts, ...newItems];
    setCharts(updated);
    saveCharts(updated);
    setPrimaryType('');
    setChartSubType('');
    setShowDropdown(false);
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
    if (field === 'labels') updated[index].data.labels = values;
    else if (field === 'values') updated[index].data.values = values.map(Number);
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

  const deleteChart = (index) => {
    const updated = charts.filter((_, i) => i !== index);
    setCharts(updated);
    saveCharts(updated);
  };

  const getChartData = (chart) => ({
    labels: chart.data.labels,
    datasets: [{
      label: 'Dataset',
      data: chart.data.values,
      backgroundColor: [
        '#4dc9f6', '#f67019', '#f53794',
        '#537bc4', '#acc236', '#166a8f', '#00a950',
      ],
    }],
  });

  const handleLayoutChange = (layout) => {
    const updated = charts.map((chart, index) => {
      const l = layout.find((lay) => lay.i === index.toString());
      return { ...chart, layout: l || chart.layout };
    });
    setCharts(updated);
    saveCharts(updated);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="max-w-screen-xl" ref={containerRef}>
        <GridLayout
          className="layout"
          layout={charts.map((chart, i) => ({
            i: i.toString(),
            x: chart.layout?.x ?? (i * 2) % 12,
            y: chart.layout?.y ?? Infinity,
            w: chart.layout?.w ?? 6,
            h: chart.layout?.h ?? 8,
          }))}
          cols={12}
          rowHeight={30}
          width={width}
          onLayoutChange={handleLayoutChange}
        >
          {charts.map((chart, index) => (
            <div
              key={index.toString()}
              className="border-2 border-black p-4 rounded-lg relative bg-white overflow-hidden"
            >
            

              {chart.type === '' && (
                <select
                  onChange={(e) => selectChartType(index, e.target.value)}
                  className="border p-2 rounded w-full mb-2"
                >
                  <option value="">Select Chart Type</option>
                  {[...chartSubTypes, 'textbox', 'table'].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              )}

              {chartSubTypes.includes(chart.type) && (
                <>
                  {chart.type === 'line' && <Test />}
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

              {chart.type === 'textbox' && (
                <textarea
                  className="border p-2 w-full h-full resize-none"
                  placeholder="Write something here..."
                  value={chart.data.text}
                  onChange={(e) => updateTextbox(index, e.target.value)}
                />
              )}

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
          ))}
        </GridLayout>

        {showDropdown ? (
          <div className="mt-4">
            {!primaryType && (
              <select
                value={primaryType}
                onChange={(e) => setPrimaryType(e.target.value)}
                className="border p-2 rounded mr-2"
              >
                <option value="">Select Type</option>
                {primaryTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            )}

            {primaryType === 'chart' && !chartSubType && (
              <select
                value={chartSubType}
                onChange={(e) => {
                  setChartSubType(e.target.value);
                  addChart(e.target.value);
                }}
                className="border p-2 rounded"
              >
                <option value="">Select Chart Type</option>
                {chartSubTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            )}

            {(primaryType === 'textbox' || primaryType === 'table') && (
              <button
                onClick={() => addChart(primaryType)}
                className="bg-green-500 text-white px-4 py-2 rounded ml-2"
              >
                Add {primaryType}
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowDropdown(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded flex mt-4"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        )}
      </div>
    </div>
  );
};

export default ChartDashboard;
