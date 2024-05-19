import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { scenarioResponse, vehicleErrors, vehicleType } from '../utils/types';
import toast from 'react-hot-toast';
import { addVehicle, getAllScenarios } from '../services/services';

const Vehicles = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<vehicleType>({
    vehicleName: "",
    initialPositionX: 0,
    initialPositionY: 0,
    speed: 0,
    direction: "",
    scenarioId: ""
  });

  const [errors, setErrors] = useState<Partial<vehicleErrors>>({
    vehicleName: "",
    initialPositionX: "",
    initialPositionY: "",
    speed: "",
    direction: ""
  });

  const [scenarios, setScenarios] = useState<scenarioResponse[]>([])

  const forFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const formatData = (name === 'initialPositionX' || name === 'initialPositionY' || name === 'speed')
      ? parseInt(value, 10)
      : value;
    setForm({ ...form, [name]: formatData });

  };

  const forValidateForm = () => {
    const newErrors: Partial<vehicleErrors> = {};

    if (!form.vehicleName) {
      newErrors.vehicleName = 'Vehicle Name is required';
    }

    if (isNaN(form.initialPositionX)) {
      newErrors.initialPositionX = 'Initial Position X must be a number';
    } else if (form.initialPositionX <= 0 || form.initialPositionX > 800) {
      newErrors.initialPositionX = 'Initial Position X must be between 0 and 800';
    }

    if (isNaN(form.initialPositionY)) {
      newErrors.initialPositionY = 'Initial Position Y must be a number';
    } else if (form.initialPositionY <= 0 || form.initialPositionY > 800) {
      newErrors.initialPositionY = 'Initial Position Y must be between 0 and 800';
    }

    if (isNaN(form.speed) || form.speed <= 0) {
      newErrors.speed = 'Speed must be a positive number';
    }

    if (!form.direction) {
      newErrors.direction = 'Direction is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const forSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (forValidateForm()) {
      try {
        const { scenarioId, ...formData } = form
        console.log(formData);
        console.log(scenarioId)

        await addVehicle(form, scenarioId);
        toast.success('Vehicle added successfully');
        navigate('/scenarios');
      } catch (error: any) {
        toast.error(error?.message);
      }
    } else {
      toast.error('Please fill all fields correctly');
    }
  };

  const getScenarios = async () => {
    try {
      const response = await getAllScenarios();
      setScenarios(response.data.result);
      console.log(response.data.result);
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  useEffect(() => {
    getScenarios();
  }, []);

  return (
    <React.Fragment>
      <div style={{ padding: '48px' }}>
        <h1>Add Vehicle</h1>
        <form onSubmit={forSubmit}>
          <div className='add-vehicle'>
            <div>
              <div>Scenario</div>
              <select className='select-dropdown'
                name='scenarioId'
                value={form.scenarioId}
                onChange={forFormChange}
              >
                <option value="">Select a scenario</option>
                {scenarios.map(scenario => (
                  <option key={scenario._id} value={scenario._id}>
                    {scenario.name}
                  </option>
                ))}
              </select>
              <p style={{ color: 'red' }}>{errors.vehicleName}</p>

            </div>
            <div>
              <div>Speed</div>
              <InputField
                placeholder='Speed'
                type='number'
                name='speed'
                data={"Speed"}
                error={errors.speed}
                changeFunction={forFormChange}
                value={form.speed}
              />
            </div>
            <div>
              <div>Vehicle Name</div>
              <InputField
                placeholder='Vehicle Name'
                type='text'
                name='vehicleName'
                data={"Vehicle Name"}
                error={errors.vehicleName}
                changeFunction={forFormChange}
                value={form.vehicleName}
              />
            </div>
          </div>
          <div className="add-scenario">
            <div>
              <div>Initial Position X</div>
              <InputField
                placeholder='Initial Position X'
                type='number'
                name='initialPositionX'
                data={"Initial Position X"}
                error={errors.initialPositionX}
                changeFunction={forFormChange}
                value={form.initialPositionX}
              />
            </div>
            <div>
              <div>Initial Position Y</div>
              <InputField
                placeholder='Initial Position Y'
                type='number'
                name='initialPositionY'
                data={"Initial Position Y"}
                error={errors.initialPositionY}
                changeFunction={forFormChange}
                value={form.initialPositionY}
              />
            </div>
            <div>
              <div>Direction</div>
              <select className='select-dropdown'
                name='direction'
                value={form.direction}
                onChange={forFormChange}
              >
                <option value="">Select direction</option>
                <option value="TOWARDS">Towards</option>
                <option value="BACKWARDS">Backwards</option>
                <option value="UPWARDS">Upwards</option>
                <option value="DOWNWARDS">Downwards</option>
              </select>
              <p style={{ color: 'red' }}>{errors.direction}</p>
            </div>
          </div>
          <button className='addBtn' type="submit">Add</button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Vehicles;
