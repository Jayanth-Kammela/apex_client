import React from 'react'
import { componetProps } from '../utils/types'

const InputField: React.FC<componetProps> = ({ type, placeholder, value, changeFunction, data,name,error }) => {
  return (
    <React.Fragment>
      <input className='inputfield' type={type} placeholder={placeholder} value={value} name={name} onChange={changeFunction} />
      <p style={{color:'red'}}>{error}</p>
    </React.Fragment>
  )
}

export default InputField