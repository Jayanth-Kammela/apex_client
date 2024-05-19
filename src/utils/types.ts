export interface componetProps {
    type: string;
    name: string;
    placeholder: string;
    data?: any;
    changeFunction: any;
    error?: string;
    value?: any
}

export interface scenarioType {
    name: string;
    time: number;
}

export interface vehicleType {
    vehicleName: string;
    initialPositionX:number;
    initialPositionY:number;
    speed:number;
    direction:string;
    scenarioId:string;
}

export interface vehicleErrors {
    vehicleName: string;
    initialPositionX:string;
    initialPositionY:string;
    speed:string;
    direction:string
}

export type scenarioErrors = {
    name: string;
    time: string;
};

export type scenarioResponse = {
    _id:string;
    name: string;
    time: string;
    vehicles:[]
};

export interface vehicleResponse {
    _id: string;
    vehicleName: string;
    initialPositionX: number;
    initialPositionY: number;
    speed: number;
    direction: string;
  }
  