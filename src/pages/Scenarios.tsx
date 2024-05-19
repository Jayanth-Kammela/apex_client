import React, { useEffect, useState } from 'react';
import { deleteScenario, getAllScenarios } from '../services/services';
import { scenarioResponse } from '../utils/types';
import { DeleteIcon, EditIcon, PlusIcon } from '../utils/svg';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Scenarios = () => {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState<scenarioResponse[]>([]);

  const getScenarios = async () => {
    try {
      const response = await getAllScenarios();
      setScenarios(response.data.result);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const deleteScenarioById = async (id: string) => {
    try {
      const response: any = await deleteScenario(id);
      toast.success(response?.message);
      getScenarios();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const editScenarioById = (item: scenarioResponse) => {
    navigate('/add-scenario', { state: { scenario: item } });
  };

  useEffect(() => {
    getScenarios();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: 'black', color: 'white' }}>
          <tr>
            <th style={{ padding: '10px', border: '1px solid black' }}>Scenario Id</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Scenario Name</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Scenario Time</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>No of Vehicles</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Add Vehicle</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Edit</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Delete</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: 'white', color: 'black' }}>
          {scenarios.map((item: scenarioResponse) => (
            <tr key={item._id}>
              <td style={{ padding: '10px', border: '1px solid black', textAlign: 'center' }}>{item._id}</td>
              <td style={{ padding: '10px', border: '1px solid black', textAlign: 'center' }}>{item.name}</td>
              <td style={{ padding: '10px', border: '1px solid black', textAlign: 'center' }}>{item.time}</td>
              <td style={{ padding: '10px', border: '1px solid black', textAlign: 'center' }}>{item.vehicles.length}</td>
              <td style={{ padding: '10px', border: '1px solid black', textAlign: 'center',cursor: 'pointer' }} onClick={() => navigate('/vehicles')}><PlusIcon/></td>
              <td style={{ padding: '10px', border: '1px solid black', textAlign: 'center' }}>
                <span style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => editScenarioById(item)}><EditIcon /></span>
              </td>
              <td style={{ padding: '10px', border: '1px solid black', textAlign: 'center' }}>
              <span style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => deleteScenarioById(item._id)}><DeleteIcon /></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scenarios;
