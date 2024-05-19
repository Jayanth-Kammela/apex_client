import React, { useEffect, useState, useRef } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import toast from 'react-hot-toast';
import { getAllScenarios, getScenario, getVehicle } from '../services/services';
import { scenarioResponse, vehicleResponse } from '../utils/types';

Chart.register(...registerables);

const Home = () => {
  const [scenarios, setScenarios] = useState<scenarioResponse[]>([]);
  const [tableScenarios, setTableScenarios] = useState<vehicleResponse[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<scenarioResponse | null>(null);
  const [simulation, setSimulation] = useState(false);
  const [simulationData, setSimulationData] = useState<{ x: number; y: number }[]>([]);
  const chartRef = useRef<Chart | null | any>(null);

  const getScenarios = async () => {
    try {
      const response = await getAllScenarios();
      setScenarios(response?.data?.result);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const getVehicleById = async (id: string) => {
    try {
      const response = await getVehicle(id);
      return response?.data?.result;
    } catch (error: any) {
      toast.error(error?.message);
      return null;
    }
  };

  const getTableScenarios = async (id: string) => {
    try {
      const response = await getScenario(id);
      const scenario = response?.data?.result;
      setSelectedScenario(scenario);

      if (scenario?.vehicles && Array.isArray(scenario.vehicles)) {
        const vehicles = [];
        for (const vehicle of scenario.vehicles) {
          if (vehicle._id) {
            const vehicleData = await getVehicleById(vehicle._id);
            if (vehicleData) vehicles.push(vehicleData);
          }
        }
        setTableScenarios(vehicles);
        setSimulationData(vehicles.map(vehicle => ({
          x: vehicle.initialPositionX,
          y: vehicle.initialPositionY,
        })));
      } else {
        setTableScenarios([]);
        setSimulationData([]);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    getScenarios();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'scenarioName') {
      getTableScenarios(value);
      setSimulation(false);
    }
  };

  const startSimulation = () => {
    setSimulation(true);

    const interval = setInterval(() => {
      const updatedData = simulationData.map((data, index) => {
        let { x, y } = data;
        const vehicle = tableScenarios[index];
        switch (vehicle.direction) {
          case 'TOWARDS':
            x += vehicle.speed;
            break;
          case 'BACKWARDS':
            x -= vehicle.speed;
            break;
          case 'UPWARDS':
            y -= vehicle.speed;
            break;
          case 'DOWNWARDS':
            y += vehicle.speed;
            break;
          default:
            break;
        }
        return { x, y };
      });
      setSimulationData(updatedData);
      if (chartRef.current) {
        chartRef.current.data.datasets[0].data = updatedData;
        chartRef.current.update();
      }
    }, 1000);

    if (selectedScenario) {
      setTimeout(() => {
        clearInterval(interval);
        setSimulation(false);
      }, parseInt(selectedScenario.time,10) * 1000);
    }
  };

  const chartData = {
    datasets: [
      {
        label: 'Vehicle Positions',
        data: simulationData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'X Position',
        },
        min: 0,
        max: 800,
      },
      y: {
        title: {
          display: true,
          text: 'Y Position',
        },
        min: 0,
        max: 800,
      },
    },
  };

  return (
    <React.Fragment>
      <div style={{ padding: '48px' }}>
        <div>Scenario</div>
        <select className='select-dropdown' name='scenarioName' onChange={handleFormChange}>
          <option value="">Select a scenario</option>
          {scenarios.map(scenario => (
            <option key={scenario?._id} value={scenario?._id}>
              {scenario?.name}
            </option>
          ))}
        </select>
        <button onClick={startSimulation} disabled={simulation || tableScenarios.length === 0}>
          {simulation ? 'Simulation in progress' : 'Start Simulation'}
        </button>
      </div>

      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: 'black', color: 'white' }}>
            <tr>
              <th style={{ padding: '10px', border: '1px solid black' }}>Vehicle Id</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Vehicle Name</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Position X</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Position Y</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Speed</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Direction</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'white', color: 'black' }}>
            {tableScenarios.map(vehicle => (
              <tr key={vehicle._id}>
                <td style={{ padding: '10px', border: '1px solid black' }}>{vehicle._id}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{vehicle.vehicleName}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{vehicle.initialPositionX}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{vehicle.initialPositionY}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{vehicle.speed}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{vehicle.direction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ backgroundColor: 'black', color: '#FFFFFF',margin:20 }}>
        <Scatter data={chartData} options={chartOptions} ref={chartRef} />
      </div>
    </React.Fragment>
  );
};

export default Home;