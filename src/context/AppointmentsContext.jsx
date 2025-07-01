import React, { createContext, useState, useEffect } from 'react';

export const AppointmentsContext = createContext();

const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Add new appointment
  const addAppointment = (appointment) => {
    setAppointments((prev) => [...prev, appointment]);
  };

  // Update existing appointment by id
  const updateAppointment = (updatedAppointment) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === updatedAppointment.id ? { ...appt, ...updatedAppointment } : appt
      )
    );
  };

  // Delete appointment by id
  const deleteAppointment = (id) => {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  return (
    <AppointmentsContext.Provider
      value={{ appointments, addAppointment, updateAppointment, deleteAppointment }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

export default AppointmentsProvider;
