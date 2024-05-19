import axios from "axios";

const url = 'http://localhost:9493/api/v1'

export const createScenario = async (data: any) => {
    const response = await axios.post(`${url}/post-scenario`, data);
    return response
}

export const getAllScenarios = async () => {
    const response = await axios.get(`${url}/get-scenarios`);
    return response
}

export const getScenario = async (id: string) => {
    const response = await axios.get(`${url}/scenario/${id}`);
    return response
}

export const updateScenario = async (data: any, id: string) => {
    const response = await axios.patch(`${url}/scenario/${id}`, data);
    return response
}

export const deleteScenario = async (id: string) => {
    const response = await axios.delete(`${url}/scenario/${id}`);
    return response
}

export const addVehicle = async (data: any,id:string) => {
    const response = await axios.post(`${url}/post-vehicle/${id}`, data);
    return response
}

export const getVehicle = async (id: string) => {
    const response = await axios.get(`${url}/vehicle/${id}`);
    return response
}