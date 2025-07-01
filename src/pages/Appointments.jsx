import React, { useContext } from 'react';
import { AppointmentsContext } from '../context/AppointmentsContext';

const Appointments = () => {
  const { appointments } = useContext(AppointmentsContext);

  if (appointments.length === 0) {
    return <p className="text-center text-gray-600">No appointments booked yet.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Booked Appointments</h2>
      <table className="min-w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Phone</th>
            <th className="border px-4 py-2 text-left">Booked At</th>
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
