import React, { useState, useEffect } from 'react';

const Patients = () => {
  // Load patients from localStorage 
  const [patients, setPatients] = useState(() => {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : [];
  });

  // Form fields
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [healthInfo, setHealthInfo] = useState('');

  //stores the details of edited patient
  const [editingPatientId, setEditingPatientId] = useState(null);

  // Save patients to localStorage whenever patients state changes
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  // Add or update patient on form submit
  const handleAddOrUpdatePatient = (e) => {
    e.preventDefault();

    if (!fullName || !dob || !email) {
      alert('Please provide full name, date of birth, and email');
      return;
    }

    if (editingPatientId) {
      // Update existing patient
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === editingPatientId
            ? { ...patient, fullName, dob, email, phone, healthInfo }
            : patient
        )
      );
      setEditingPatientId(null);
    } else {
      // Add new patient
      const newPatient = {
        id: Date.now(),
        fullName,
        dob,
        email,
        phone,
        healthInfo,
      };
      setPatients([...patients, newPatient]);
    }

    // Clear form
    setFullName('');
    setDob('');
    setEmail('');
    setPhone('');
    setHealthInfo('');
  };

  // Delete patient by id
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter((p) => p.id !== id));
      // If deleting the patient currently being edited, reset form
      if (editingPatientId === id) {
        setEditingPatientId(null);
        setFullName('');
        setDob('');
        setEmail('');
        setPhone('');
        setHealthInfo('');
      }
    }
  };

  // Start editing a patient
  const handleEdit = (patient) => {
    setEditingPatientId(patient.id);
    setFullName(patient.fullName);
    setDob(patient.dob);
    setEmail(patient.email);
    setPhone(patient.phone || '');
    setHealthInfo(patient.healthInfo || '');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPatientId(null);
    setFullName('');
    setDob('');
    setEmail('');
    setPhone('');
    setHealthInfo('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Patients</h1>

      {/* Add / Update Patient Form */}
      <form
        onSubmit={handleAddOrUpdatePatient}
        className="bg-white p-6 rounded shadow mb-8 max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingPatientId ? 'Update Patient' : 'Add New Patient'}
        </h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="fullName">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Patient full name"
            required
          />
        </div>

        {/* DOB*/}
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="dob">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            id="dob"
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Patient email"
            required
          />
        </div>

        
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Patient phone number"
          />
        </div>

        {/* Health Informations */}
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="healthInfo">
            Health Info
          </label>
          <textarea
            id="healthInfo"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={healthInfo}
            onChange={(e) => setHealthInfo(e.target.value)}
            placeholder="Patient health information (allergies, conditions, etc.)"
            rows={3}
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingPatientId ? 'Update Patient' : 'Add Patient'}
          </button>

          {editingPatientId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Patients List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-6 text-left">Full Name</th>
              <th className="py-3 px-6 text-left">DOB</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Health Info</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No patients found.
                </td>
              </tr>
            ) : (
              patients.map(({ id, fullName, dob, email, phone, healthInfo }) => (
                <tr key={id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{fullName}</td>
                  <td className="py-3 px-6">{dob}</td>
                  <td className="py-3 px-6">{email}</td>
                  <td className="py-3 px-6">{phone || '-'}</td>
                  <td className="py-3 px-6">{healthInfo || '-'}</td>
                  <td className="py-3 px-6 text-center space-x-2">
                    <button
                      onClick={() =>
                        handleEdit({ id, fullName, dob, email, phone, healthInfo })
                      }
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      aria-label={`Edit patient ${fullName}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                      aria-label={`Delete patient ${fullName}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
