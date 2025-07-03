import React, { useContext } from 'react';
import { AppointmentsContext } from '../context/AppointmentsContext';

const Appointments = () => {
  const { appointments } = useContext(AppointmentsContext);

  if (appointments.length === 0) {
    return <p className="text-center text-gray-600"> No appointments booked yet.</p>;
  }

  return (
    <div className="max-w-4xl  p-4 bg-white mx-autorounded shadow">
      <h2 className="text-2xl  mb-4 font-semibold">Booked Appointments</h2>
      <table className="min-w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border  text-left px-4 py-2">Name</th>
            <th className="border  text-left px-4 py-2">Email</th>
            <th className="border  text-left px-4 py-2">Phone</th>
            <th className="border  text-left px-4 py-2">Booked At</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(({ id, fullName, email, phone, bookedAt }) => (
            <tr key={id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{fullName}</td>
              <td className="border px-4 py-2">{email}</td>
              <td className="border px-4 py-2">{phone}</td>
              <td className="border px-4 py-2">
                {new Date(bookedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;
