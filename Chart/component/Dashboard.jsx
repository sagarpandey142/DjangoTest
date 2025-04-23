import React, { useState, useEffect, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import {
   Line, Radar, PolarArea, Bubble, Pie,
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
import Textbox from "./TextBox"
import { FaPlus, FaTrash } from 'react-icons/fa'; // Delete icon added here
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import axios from 'axios';
import Test from "./Test";
import  Doughnut  from './Doughnut';
import Bar from "./Bar"
import Table from './Table';
import Image from "./Image"

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
  const[data,setdata]=useState();
  const [destructuredValues, setDestructuredValues] = useState({ value1: null, value2: null });
  const[text,SetText]=useState()
  const primaryTypes = ['chart', 'textbox', 'table','image'];
  const chartSubTypes = [ 'line', 'doughnut','bar'];
//'bar', 'line', 'doughnut', 'radar', 'polar', 'bubble', 'pie
  const getUserId = () => {
    return localStorage.getItem('user_id') || 'guest';
  };
  useEffect(() => {
    if (!data) return;
  
    const match = data.match(/\(([^)]+)\)/); // get content inside parentheses
    if (match) {
      const numbers = match[1].split(',').map(num => parseInt(num.trim(), 10));
      const [value1, value2] = numbers;
      setDestructuredValues({ value1, value2 });
    }
  }, [data]);
  
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
      newItems.push({ type, data: { labels: [], values: [] }, size: 'bigger', groupId, layout: {} ,functionName:data});
    } else if (type === 'textbox') {
      newItems.push({ type, data: { textValue:'' }, size: 'bigger', groupId, layout: {},functionName:data});

    } else if (type === 'table') {
      newItems.push({ type, data: { rows: [['', ''], ['', '']] }, size: 'bigger', groupId, layout: {},functionName:data });
    }
    else if (type === 'image') {
      newItems.push({ type, data: { rows: [['', ''], ['', '']] }, size: 'bigger', groupId, layout: {},functionName:data });
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
    console.log("index")
    const updated = charts.filter((_, i) => i !== index);
    setCharts(updated);
    saveCharts(updated);
  };
  console.log("daa",data)

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
  const fetchtext=async ()=>{
   const result=await  axios.get(`${BASE_URL}/get_text_value/`)
    console.log("res",result)
    console.log("daa",result.data.result.rows[0].get_text_value)
    SetText(result.data.result.rows[0].get_text_value)
     
  }
 
  const handleLayoutChange = (layout) => {
    const updated = charts.map((chart, index) => {
      const l = layout.find((lay) => lay.i === index.toString());
      return { ...chart, layout: l || chart.layout };
    });
    setCharts(updated);
    saveCharts(updated);
  };
  useEffect(()=>{
    const interval = setInterval(() => {
      fetchtext();
    }, 1000); 
  
    return () => clearInterval(interval);
  },[])
  console.log("charts",charts)
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
              className="border-2 border-black p-4 rounded-lg  bg-white overflow-hidden relative"
            >
           <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  deleteChart(index);
                }}
                onMouseDown={(e) => e.stopPropagation()}
               
                title="Delete chart"
              >
                <FaTrash size={12} />
              </button>
             
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
                  
                  {/* <input
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
                  /> */}
                  <div className="w-full flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full">
                      {chart.type === 'bar' && <Bar functionName={chart?.functionName}/>}
                       {chart.type === 'line' && <Test functionName={chart?.functionName} />}
                      {chart.type === 'doughnut' && <Doughnut functionName={chart?.functionName} deleteChart={deleteChart} index={index} />}
                      {chart.type === 'radar' && <Radar data={getChartData(chart)} />}
                      {chart.type === 'polar' && <PolarArea data={getChartData(chart)} />}
                      {chart.type === 'bubble' && <Bubble data={getChartData(chart)} />}
                      {chart.type === 'pie' && <Pie data={getChartData(chart)} />}
                    </div>
                  </div>
                </>
              )}

              {chart.type === 'textbox' && (
               <Textbox functionName={chart.functionName}/>
              )}

              {chart.type === 'table' && (
                <Table functionName={chart.functionName}/>
              )}
              {chart.type === 'image' && (
                <Image functionName={chart.functionName}/>
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
           {
            primaryType==='chart' && !chartSubType && (
              <input placeholder='enter function name ' onChange={(e)=>{
                 setdata(e.target.value)
              }}  className="border border-gray-300 ml-2 p-2 rounded-md w-30% mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
            )
           }

           {(primaryType === 'textbox' || primaryType === 'table' || primaryType==='image') && (
              <div className="flex items-center mt-2">
                <button
                  onClick={() => addChart(primaryType)}
                  className="bg-green-500 text-white px-4 py-2 rounded ml-2"
                >
                  Add {primaryType}
                </button>
                <input
                  placeholder="Enter function name"
                  onChange={(e) => setdata(e.target.value)}
                  className="border border-gray-300 ml-2 p-2 rounded-md w-[30%] focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
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
