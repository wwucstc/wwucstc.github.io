import { Routes, Route, Link } from 'react-router-dom';
import TicketForm from './components/TicketForm';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar (Optional, but helpful for testing) */}
      <nav className="bg-white shadow p-4 mb-8 flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline">Student Home</Link>
        <Link to="/login" className="text-blue-600 hover:underline">Tutor Login</Link>
        <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
      </nav>

      {/* The "Screen" that changes based on URL */}
      <Routes>
        <Route path="/" element={<StudentLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

// A small wrapper component to keep the "CS Tutoring Center" header 
// only on the Student page
function StudentLayout() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">CS Tutoring Center</h1>
        <p className="mt-2 text-lg text-gray-600">
          Submit your question below and a tutor will be with you shortly.
        </p>
      </div>
      <TicketForm />
    </div>
  );
}

export default App;