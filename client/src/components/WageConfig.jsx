import { useState } from 'react';
import axiosInstance from '../config/axiosInstance';

const WageConfig = () => {
  const [employeeWage, setEmployeeWage] = useState('');
  const [supervisorWage, setSupervisorWage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (role, wage) => {
    try {
      const response = await axiosInstance.post('/bookings/wages/config', {
        role,
        wage: parseFloat(wage),
      });
      setSuccess(`Wage for ${role} set to ₹${wage}`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to set wage for ${role}`);
      setSuccess('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Configure Wages</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="grid gap-4">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Employee Wage</h3>
          <input
            type="number"
            placeholder="Enter wage amount"
            value={employeeWage}
            onChange={(e) => setEmployeeWage(e.target.value)}
            className="border p-2 rounded mr-2"
            min="0"
            step="0.01"
          />
          <button
            onClick={() => handleSubmit('employee', employeeWage)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={!employeeWage || employeeWage < 0}
          >
            Set Employee Wage
          </button>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Supervisor Wage</h3>
          <input
            type="number"
            placeholder="Enter wage amount"
            value={supervisorWage}
            onChange={(e) => setSupervisorWage(e.target.value)}
            className="border p-2 rounded mr-2"
            min="0"
            step="0.01"
          />
          <button
            onClick={() => handleSubmit('supervisor', supervisorWage)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={!supervisorWage || supervisorWage < 0}
          >
            Set Supervisor Wage
          </button>
        </div>
      </div>
    </div>
  );
};

export default WageConfig;