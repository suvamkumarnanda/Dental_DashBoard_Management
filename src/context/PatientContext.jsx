// src/context/PatientsContext.jsx
import React, { createContext, useState } from 'react';

export const PatientsContext = createContext();

 const PatientsProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);

  const addPatient = (patient) => {
    setPatients((prev) => [...prev, patient]);
  };

  return (
    <PatientsContext.Provider value={{ patients, addPatient }}>
      {children}
    </PatientsContext.Provider>
  );
};
export default PatientsProvider;    
