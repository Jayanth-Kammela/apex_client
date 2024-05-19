import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { scenarioErrors, scenarioType } from '../utils/types';
import toast from 'react-hot-toast';
import { createScenario, updateScenario } from '../services/services';

const Scenario = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const scenario = location.state?.scenario || null;

    const [form, setForm] = useState<scenarioType>(scenario || { name: "", time: 0 });
    const [errors, setErrors] = useState<scenarioErrors>({ name: "", time: "" });

    const forFormChange = (e: any) => {
        const { name, value } = e.target;
        const formatData = name === 'time' ? parseInt(value, 10) : value;
        setForm({ ...form, [name]: formatData });
    };

    const forSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: scenarioErrors = { name: '', time: '' };

        if (!form.name) {
            newErrors.name = 'Scenario Name is required';
        }

        if (!form.time) {
            newErrors.time = 'Time is required';
        } else {
            const timeValue = Number(form.time);
            if (isNaN(timeValue) || timeValue === 0) {
                newErrors.time = 'Time must be valid digits';
            } else if (timeValue < 0) {
                newErrors.time = 'Time must be positive digits';
            }
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error !== '')) {
            toast.error('Please fill all fields');
        } else {
            try {
                if (scenario) {
                    await updateScenario(form, scenario._id);
                    toast.success('Scenario updated successfully');
                } else {
                    await createScenario(form);
                    toast.success('Scenario created successfully');
                }
                navigate('/scenarios');
            } catch (error: any) {
                toast.error(error?.message);
            }
        }
    };

    return (
        <React.Fragment>
            <div style={{padding:'48px'}}>
                <h1>{scenario ? 'Edit Scenario' : 'Add Scenario'}</h1>
                <form onSubmit={forSubmit}>
                    <div className='add-scenario'>
                        <div>
                            <div>Scenario Name</div>
                            <InputField
                                placeholder='Test Scenario'
                                type='text'
                                name='name'
                                data={"Scenario Name"}
                                error={errors.name}
                                changeFunction={forFormChange}
                                value={form.name}
                            />
                        </div>
                        <div>
                            <div>Scenario Time(seconds)</div>
                            <InputField
                                placeholder='Scenario Time'
                                type='number'
                                name='time'
                                data={"Scenario Time"}
                                error={errors.time}
                                changeFunction={forFormChange}
                                value={form.time}
                            />
                        </div>
                    </div>
                    <button className='addBtn' type="submit">{scenario ? 'Update' : 'Add'}</button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default Scenario;
