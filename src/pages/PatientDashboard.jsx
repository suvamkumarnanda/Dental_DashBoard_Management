import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppointmentsContext } from '../context/AppointmentsContext';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const { appointments } = useContext(AppointmentsContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-aqua-50 p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-black-700">Not Logged In</h2>
          <p className="text-gray-700 mb-4">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const [activeSection, setActiveSection] = useState('appointments');

  const upcomingAppointments = appointments
    .filter(
      (appt) =>
        appt.patientId === user.id &&
        new Date(appt.appointmentDateTime) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime)
    );

  const lastTreatment = [...appointments]
    .filter((appt) => appt.patientId === user.id && appt.treatment)
    .sort(
      (a, b) =>
        new Date(b.appointmentDateTime) - new Date(a.appointmentDateTime)
    )[0];

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-black-800 mb-4">
          Welcome back,{' '}
          {user.name ||
            user?.email?.split('@')[0].replace(/\d+/g, '') ||
            'Patient'}
          !
        </h1>
        <p className="text-gray-700 text-lg">
          Manage your dental health easily with your personalized dashboard.
        </p>
      </header>

      {/* Navigation */}
      <nav className="flex justify-center space-x-6 mb-10">
        <button
          onClick={() => setActiveSection('appointments')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            activeSection === 'appointments'
              ? 'bg-pink-700 text-white'
              : 'bg-white text-black-700 shadow'
          }`}
        >
          Appointments
        </button>
        <button
          onClick={() => setActiveSection('treatments')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            activeSection === 'treatments'
              ? 'bg-pink-700 text-white'
              : 'bg-white text-black-700 shadow'
          }`}
        >
          Treatments
        </button>
        <button
          onClick={() => setActiveSection('profile')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            activeSection === 'profile'
              ? 'bg-pink-700 text-white'
              : 'bg-white text-black-700 shadow'
          }`}
        >
          Profile
        </button>
      </nav>

     
      <section>
        {activeSection === 'appointments' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black-700">
              Your Upcoming Appointments
            </h2>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-600">No upcoming appointments.</p>
            ) : (
              <ul className="space-y-4">
                {upcomingAppointments.map((appt) => (
                  <li
                    key={appt.id}
                    className="bg-white p-4 rounded shadow"
                  >
                    <p>
                      <strong>Date:</strong>{' '}
                      {new Date(appt.appointmentDateTime).toLocaleString()}
                    </p>
                    <p>
                      <strong>Treatment:</strong>{' '}
                      {appt.treatment || 'General Checkup'}
                    </p>
                    <p>
                      <strong>Status:</strong> {appt.status || 'Scheduled'}
                    </p>
                    <p>
                      <strong>Notes:</strong> {appt.notes || '-'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeSection === 'treatments' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black-700">
              Your Last Treatment Details
            </h2>
            {!lastTreatment ? (
              <p className="text-gray-600">No treatment records found.</p>
            ) : (
              <div className="bg-white p-6 rounded shadow max-w-xl">
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(lastTreatment.appointmentDateTime).toLocaleDateString()}
                </p>
                <p>
                  <strong>Treatment Type:</strong> {lastTreatment.treatment}
                </p>
                <p>
                  <strong>Notes:</strong> {lastTreatment.notes || '-'}
                </p>
                <p>
                  <strong>Cost:</strong> ₹
                  {lastTreatment.cost !== undefined
                    ? lastTreatment.cost.toFixed(2)
                    : 'N/A'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-black-700">
              Your Profile Details
            </h2>
            <div className="space-y-4">
              <div>
                <span className="block font-semibold mb-1">Name</span>
                <div className="w-full border border-gray-300 rounded p-2 bg-gray-50">
                  {user.name || '-'}
                </div>
              </div>
              <div>
                <span className="block font-semibold mb-1">Email</span>
                <div className="w-full border border-gray-300 rounded p-2 bg-gray-50">
                  {user.email || '-'}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PatientDashboard;
