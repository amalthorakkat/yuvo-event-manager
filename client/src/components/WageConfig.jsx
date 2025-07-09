import { useState, useContext, useEffect, useRef } from "react";
import axiosInstance from "../config/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const WageConfig = () => {
  const { user, loading } = useContext(AuthContext);
  const [employeeWage, setEmployeeWage] = useState("");
  const [supervisorWage, setSupervisorWage] = useState("");
  const [email, setEmail] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wages, setWages] = useState({
    employeeWage: null,
    supervisorWage: null,
  });
  const [showWageForm, setShowWageForm] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    console.log("WageConfig: User:", user);
    if (user && user.role === "admin") {
      fetchWageConfig();
      fetchPaymentHistory();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchWageConfig = async () => {
    try {
      setError("");
      console.log("Fetching wage config");
      const response = await axiosInstance.get("/bookings/wage-config");
      setWages({
        employeeWage: response.data.employeeWage,
        supervisorWage: response.data.supervisorWage,
      });
      console.log("Wage config fetched:", response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch wage configuration"
      );
      console.error(
        "Fetch wage config error:",
        err.response?.data || err.message
      );
    }
  };

  const handleWageSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      console.log("Submitting wage config:", { employeeWage, supervisorWage });
      await axiosInstance.post("/bookings/wage-config", {
        employeeWage: parseFloat(employeeWage),
        supervisorWage: parseFloat(supervisorWage),
      });
      setSuccess("Wage configuration updated successfully");
      setWages({
        employeeWage: parseFloat(employeeWage),
        supervisorWage: parseFloat(supervisorWage),
      });
      setShowWageForm(false);
      setEmployeeWage("");
      setSupervisorWage("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update wage configuration"
      );
      console.error("Wage submit error:", err.response?.data || err.message);
    }
  };

  const handleSearch = async () => {
    try {
      setError("");
      setSuccess("");
      console.log("Searching earnings for email:", email);
      const response = await axiosInstance.get(
        `/bookings/earnings?email=${email}`
      );
      setEmployeeData(response.data.user);
      console.log("Employee earnings:", response.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch employee earnings"
      );
      setEmployeeData(null);
      console.error("Search error:", err.response?.data || err.message);
    }
  };

  const handlePayment = async () => {
    try {
      setError("");
      setSuccess("");
      if (!paymentAmount || paymentAmount <= 0) {
        setError("Please enter a valid payment amount");
        return;
      }
      console.log("Processing payment:", {
        employeeId: employeeData._id,
        amountPaid: paymentAmount,
      });
      await axiosInstance.post("/bookings/payment", {
        employeeId: employeeData._id,
        amountPaid: parseFloat(paymentAmount),
      });
      setSuccess("Payment processed successfully");
      setPaymentAmount("");
      const updatedResponse = await axiosInstance.get(
        `/bookings/earnings?email=${email}`
      );
      setEmployeeData(updatedResponse.data.user);
      console.log("Updated employee data:", updatedResponse.data.user);
      const historyResponse = await axiosInstance.get(
        "/bookings/payment-history"
      );
      setPaymentHistory(historyResponse.data.payments);
      console.log("Updated payment history:", historyResponse.data.payments);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process payment");
      console.error("Payment error:", err.response?.data || err.message);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setError("");
      console.log("Fetching payment history for user:", user?._id);
      const response = await axiosInstance.get("/bookings/payment-history");
      setPaymentHistory(response.data.payments);
      console.log("Payment history:", response.data.payments);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch payment history"
      );
      console.error(
        "Fetch payment history error:",
        err.response?.data || err.message
      );
    }
  };

  // Filter payment history based on search query
  const filteredPaymentHistory = paymentHistory.filter((payment) =>
    searchQuery
      ? payment.employeeId.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        payment.employeeId.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true
  );

  // Get unique employees for suggestions
  const uniqueEmployees = [
    ...new Map(
      paymentHistory.map((payment) => [
        payment.employeeId._id,
        {
          name: payment.employeeId.name,
          email: payment.employeeId.email,
        },
      ])
    ).values(),
  ].filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleSuggestionClick = (value) => {
    setSearchQuery(value);
    setShowSuggestions(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "admin") return <Navigate to="/login" />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">
        Wage Configuration and Payment Management
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Wage Configuration */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Wage Configuration</h3>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Employee Wage:</strong> ₹
            {wages.employeeWage !== null
              ? wages.employeeWage.toFixed(2)
              : "Not set"}
          </p>
          <p className="text-lg">
            <strong>Supervisor Wage:</strong> ₹
            {wages.supervisorWage !== null
              ? wages.supervisorWage.toFixed(2)
              : "Not set"}
          </p>
        </div>
        {!showWageForm && (
          <button
            onClick={() => setShowWageForm(true)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Change Wages
          </button>
        )}
        {showWageForm && (
          <form
            onSubmit={handleWageSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            <div>
              <label className="block text-sm font-medium">
                Employee Wage (₹):
              </label>
              <input
                type="number"
                value={employeeWage}
                onChange={(e) => setEmployeeWage(e.target.value)}
                className="p-2 border rounded w-full"
                placeholder="Enter employee wage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Supervisor Wage (₹):
              </label>
              <input
                type="number"
                value={supervisorWage}
                onChange={(e) => setSupervisorWage(e.target.value)}
                className="p-2 border rounded w-full"
                placeholder="Enter supervisor wage"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update Wages
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowWageForm(false);
                  setEmployeeWage("");
                  setSupervisorWage("");
                }}
                className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Search Employee */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Search Employee Earnings</h3>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter employee email"
            className="p-2 border rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>

      {/* Employee Earnings */}
      {employeeData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Earnings for {employeeData.name} ({employeeData.email})
          </h3>
          <div className="mb-4">
            <p className="text-lg">
              <strong>Total Wage Acquired:</strong> ₹
              {employeeData.workHistory
                .reduce((sum, entry) => sum + entry.wage, 0)
                .toFixed(2)}
            </p>
            <p className="text-lg">
              <strong>Fine We Got:</strong> ₹
              {employeeData.workHistory
                .reduce((sum, entry) => sum + entry.fine, 0)
                .toFixed(2)}
            </p>
            <p className="text-lg">
              <strong>Balance Amount:</strong> ₹
              {employeeData.balance.toFixed(2)}
            </p>
            <p className="text-lg">
              <strong>Amount Paid:</strong> ₹
              {employeeData.amountPaid.toFixed(2)}
            </p>
          </div>
          {/* Payment Form */}
          <div className="mb-4">
            <h4 className="text-md font-semibold mb-2">Process Payment</h4>
            <div className="flex gap-2">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter payment amount"
                className="p-2 border rounded w-full"
              />
              <button
                onClick={handlePayment}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Process Payment
              </button>
            </div>
          </div>
          <h4 className="text-md font-semibold mb-2">Work History</h4>
          <div className="grid gap-4">
            {employeeData.workHistory.length === 0 ? (
              <p>No work history available.</p>
            ) : (
              employeeData.workHistory.map((entry, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                  <p>
                    <strong>Event:</strong> {entry.eventName}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(entry.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Attendance:</strong> {entry.attendance}
                  </p>
                  <p>
                    <strong>Wage:</strong> ₹{entry.wage.toFixed(2)}
                  </p>
                  <p>
                    <strong>Fine:</strong> ₹{entry.fine.toFixed(2)}
                  </p>
                  <p>
                    <strong>Net Wage:</strong> ₹
                    {(entry.wage - entry.fine).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Payment History</h3>
        <div className="mb-4 relative" ref={searchRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search payment history by name or email"
            className="p-2 border rounded w-full"
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
          />
          {showSuggestions && uniqueEmployees.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-60 overflow-y-auto">
              {uniqueEmployees.map((employee, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    handleSuggestionClick(employee.name || employee.email)
                  }
                >
                  {employee.name} ({employee.email})
                </li>
              ))}
            </ul>
          )}
        </div>
        {filteredPaymentHistory.length === 0 ? (
          <p>No payment history available.</p>
        ) : (
          <div className="grid gap-4">
            {filteredPaymentHistory.map((payment, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                <p>
                  <strong>Employee:</strong> {payment.employeeId.name} (
                  {payment.employeeId.email})
                </p>
                <p>
                  <strong>Amount Paid:</strong> ₹{payment.amountPaid.toFixed(2)}
                </p>
                <p>
                  <strong>Payment Date:</strong>{" "}
                  {new Date(payment.paymentDate).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WageConfig;
