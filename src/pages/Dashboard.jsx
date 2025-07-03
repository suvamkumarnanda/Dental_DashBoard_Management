import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AuthContext } from '../context/AuthContext';
import { AppointmentsContext } from '../context/AppointmentsContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { appointments, updateAppointment, deleteAppointment } = useContext(AppointmentsContext);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    appointmentDateTime: '',
    cost: '',
    treatment: '',
    status: 'Completed',
    nextAppointmentDate: '',
    files: [],
  });

  
  const [selectedDate, setSelectedDate] = useState(null);

  //  boundaries for same day
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // Upcoming & today's appointments 
  const filteredAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.appointmentDateTime);
    return (
      appt.status !== 'Completed' &&
      appt.status !== 'Cancelled' &&
      ((apptDate >= todayStart && apptDate < todayEnd) || apptDate > today)
    );
  }).sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime));

  // All completed appointments
  const completedAppointments = appointments
    .filter(appt => appt.status === 'Completed')
    .sort((a, b) => new Date(b.appointmentDateTime) - new Date(a.appointmentDateTime));

  //get the price in INR format
  const formatINR = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '-';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  // Handlers to start editing any appointment
  const startEditing = (appt) => {
    setEditingId(appt.id);
    setFormData({
      fullName: appt.fullName,
      email: appt.email,
      phone: appt.phone,
      appointmentDateTime: appt.appointmentDateTime,
      cost: appt.cost !== undefined ? appt.cost.toString() : '',
      treatment: appt.treatment || '',
      status: appt.status || 'Scheduled',
      nextAppointmentDate: appt.nextAppointmentDate || '',
      files: appt.files || [],
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      appointmentDateTime: '',
      cost: '',
      treatment: '',
      status: 'Completed',
      nextAppointmentDate: '',
      files: [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handling  file uploads
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      file,
      url: URL.createObjectURL(file),
    }));
    setFormData(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  // Remove file from list
  const removeFile = (id) => {
    setFormData(prev => ({ ...prev, files: prev.files.filter(f => f.id !== id) }));
  };

  const saveEdit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.appointmentDateTime) {
      alert('Please fill all required fields.');
      return;
    }

    const updatedAppointment = {
      id: editingId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      appointmentDateTime: formData.appointmentDateTime,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      treatment: formData.treatment,
      status: formData.status,
      nextAppointmentDate: formData.nextAppointmentDate || undefined,
      files: formData.files,
      patientId: appointments.find(appt => appt.id === editingId)?.patientId || null,
    };

    updateAppointment(updatedAppointment);
    cancelEditing();
  };

  // Confirm and delete appointment 
  const confirmDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment(id);
      if (editingId === id) cancelEditing(); // Close edit form if deleting currently edited appointment
    }
  };

  const markCompleted = (appt) => {
    updateAppointment({ ...appt, status: 'Completed' });
  };

  const getUserName = () => {
    if (user?.email) {
      return user.email.split('@')[0].replace(/\d+/g, '') || 'User';
    }
    return 'User';
  };

  

  // Get appointments of specific date
  const getAppointmentsByDate = (date) => {
    if (!date) return [];
    const yyyy = date.getFullYear();
    const mm = date.getMonth();
    const dd = date.getDate();
    return appointments.filter(appt => {
      const apptDate = new Date(appt.appointmentDateTime);
      return (
        apptDate.getFullYear() === yyyy &&
        apptDate.getMonth() === mm &&
        apptDate.getDate() === dd
      );
    });
  };

  // mark dates with appointments
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasAppt = appointments.some(appt => {
        const apptDate = new Date(appt.appointmentDateTime);
        return (
          apptDate.getFullYear() === date.getFullYear() &&
          apptDate.getMonth() === date.getMonth() &&
          apptDate.getDate() === date.getDate()
        );
      });
      return hasAppt ? 'bg-blue-200 font-bold' : null;
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {getUserName()}!</h1>
        
      </header>

    
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Appointments Calendar</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <Calendar
            onClickDay={setSelectedDate}
            tileClassName={tileClassName}
          />
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">
              {selectedDate
                ? `Appointments on ${selectedDate.toLocaleDateString()}`
                : 'Select a date to view appointments'}
            </h3>
            {getAppointmentsByDate(selectedDate).length === 0 ? (
              <p className="text-gray-600">No appointments scheduled.</p>
            ) : (
              <ul className="space-y-2">
                {getAppointmentsByDate(selectedDate).map(appt => (
                  <li key={appt.id} className="bg-white p-3 rounded shadow">
                    <div><strong>Name:</strong> {appt.fullName}</div>
                    <div><strong>Email:</strong> {appt.email}</div>
                    <div><strong>Phone:</strong> {appt.phone}</div>
                    <div>
                      <strong>Date:</strong> {new Date(appt.appointmentDateTime).toLocaleDateString()}
                      &nbsp;
                      <strong>Time:</strong> {new Date(appt.appointmentDateTime).toLocaleTimeString()}
                    </div>
                    <div><strong>Treatment:</strong> {appt.treatment || '-'}</div>
                    <div><strong>Status:</strong> {appt.status}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
      

      {/* Treatment completed Patients Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Patients Completed Treatment</h2>
        <p className="text-lg font-bold text-green-700 mb-4">{completedAppointments.length}</p>
        {completedAppointments.length === 0 ? (
          <p className="text-gray-600">No patients have completed treatment yet.</p>
        ) : (
          <div className="overflow-x-auto max-w-5xl">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-green-100 text-green-800">
                  <th className="py-2 px-4 text-left">Patient Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Phone</th>
                  <th className="py-2 px-4 text-left">Treatment</th>
                  <th className="py-2 px-4 text-left">Cost (INR)</th>
                  <th className="py-2 px-4 text-left">Next Appointment</th>
                  <th className="py-2 px-4 text-left">Files</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedAppointments.map(appt => (
                  <tr key={appt.id} className="border-b hover:bg-green-50 align-top">
                    {editingId === appt.id ? (
                      <td colSpan="8" className="p-4">
                        <form onSubmit={saveEdit} className="space-y-3">
                          {/* Form inputs with same credentials as before */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              placeholder="Full Name"
                              required
                              className="p-2 border rounded w-full"
                            />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Email"
                              required
                              className="p-2 border rounded w-full"
                            />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Phone"
                              required
                              className="p-2 border rounded w-full"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                              type="text"
                              name="treatment"
                              value={formData.treatment}
                              onChange={handleChange}
                              placeholder="Treatment"
                              className="p-2 border rounded w-full"
                            />
                            <input
                              type="number"
                              name="cost"
                              value={formData.cost}
                              onChange={handleChange}
                              placeholder="Cost"
                              step="0.01"
                              min="0"
                              className="p-2 border rounded w-full"
                            />
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                              className="p-2 border rounded w-full"
                            >
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Pending">Pending</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="date"
                              name="nextAppointmentDate"
                              value={formData.nextAppointmentDate}
                              onChange={handleChange}
                              className="p-2 border rounded w-full"
                            />
                            <input
                              type="file"
                              multiple
                              onChange={handleFileChange}
                              className="p-2 border rounded w-full"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formData.files.map(file => (
                              <div key={file.id} className="relative border p-1 rounded bg-gray-100">
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  {file.name}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => removeFile(file.id)}
                                  className="absolute top-0 right-0 text-red-600 font-bold px-1"
                                  aria-label={`Remove file ${file.name}`}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="py-2 px-4">{appt.fullName}</td>
                        <td className="py-2 px-4">{appt.email}</td>
                        <td className="py-2 px-4">{appt.phone}</td>
                        <td className="py-2 px-4">{appt.treatment || '-'}</td>
                        <td className="py-2 px-4">{formatINR(appt.cost)}</td>
                        <td className="py-2 px-4">{appt.nextAppointmentDate ? new Date(appt.nextAppointmentDate).toLocaleDateString() : '-'}</td>
                        <td className="py-2 px-4 space-x-2">
                          {appt.files && appt.files.length > 0 ? (
                            appt.files.map(file => (
                              <a
                                key={file.id}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline block"
                                title={file.name}
                              >
                                {file.name}
                              </a>
                            ))
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => startEditing(appt)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(appt.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/*  Today's & Upcoming  Appointments */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Upcoming & Today's Appointments</h2>
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-600">No upcoming or today's appointments.</p>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {filteredAppointments.map(appt => (
              <div
                key={appt.id}
                className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between"
              >
                {editingId === appt.id ? (
                  <form
                    onSubmit={saveEdit}
                    className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full"
                  >
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="mb-2 md:mb-0 p-2 border rounded w-full"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="mb-2 md:mb-0 p-2 border rounded w-full"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="mb-2 md:mb-0 p-2 border rounded w-full"
                      required
                    />
                    <input
                      type="datetime-local"
                      name="appointmentDateTime"
                      value={formData.appointmentDateTime}
                      onChange={handleChange}
                      className="mb-2 md:mb-0 p-2 border rounded w-full"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div>
                      <div className="font-bold">{appt.fullName}</div>
                      <div>{appt.email} | {appt.phone}</div>
                      <div>
                        <span className="font-semibold">Date:</span> {new Date(appt.appointmentDateTime).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-semibold">Treatment:</span> {appt.treatment || '-'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 md:mt-0">
                      <button
                        onClick={() => startEditing(appt)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(appt.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => markCompleted(appt)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
