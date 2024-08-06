import '../styles/topbooks.css';
import NavigationBar from "../components/navbar_admin";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registrar componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Topbooks = () => {
  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 3,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        display: false,
      },
      title: {
        display: true,
        text: "Top Libros más vendidos",
        color: "white",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  const [data, setData] = useState([]);

  const colors = () => {
    const r = Math.floor(Math.random() * 256) + 80; 
    const g = Math.floor(Math.random() * 256) + 80; 
    const b = Math.floor(Math.random() * 256) + 80; 
    return `rgb(${r}, ${g}, ${b})`;
  };

  const datos = {
    labels: data.map(item => item._id),
    datasets: [
      {
        data: data.map(item => item.total),
        borderColor: 'rgb(254, 255, 255)',
        backgroundColor: data.map(() => colors()),
      },
    ],
  };

  const chartOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        ...options.plugins.title,
        font: {
          size: 24,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
          font: {
            size: 16, // Cambia el tamaño de las etiquetas en el eje X
          },
        },
      },
      y: {
        ticks: {
          color: "white",
          font: {
            size: 16, // Cambia el tamaño de las etiquetas en el eje Y
          },
        },
      },
    },
  };


  useEffect(() => {
    const fetchTop = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/sale');
        console.log(response.data)
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTop();
  }, []);

  return (
    <div>
      <NavigationBar />
      <div className="top" style={{ textAlign: "left", height: "100%" }}>
        <Bar options={chartOptions} data={datos} />

      </div>
    </div>
  );
};

export default Topbooks;
