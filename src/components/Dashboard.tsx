import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Ticket {
  _id: string;
  studentName: string;
  className: string;
  problem: string;
  stepsTaken: string;
  status: 'New' | 'In Progress' | 'Complete' | 'Closed' | 'Missed';
  createdAt: string;
  claimedBy: string | null;
  notes: string | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tutorToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTickets();

    const intervalId = setInterval(() => {
        fetchTickets();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [navigate]);

    const fetchTickets = async () => {
        try {
            const res = await fetch('/api/tickets');
            if (res.ok) {
            const data = await res.json();
            setTickets(data); // React will only re-render if data changed
            }
        } catch (error) {
            console.error("Failed to load tickets", error);
        } finally {
            setLoading(false); // This is fine, it ensures the initial spinner goes away
        }
    };

  const handleClaim = async (ticketId: string) => {
    const token = localStorage.getItem('tutorToken');
    if (!token) return;

    // Use the existing claim endpoint (we might need to update this logic later 
    // to handle status changes to "In Progress")
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ ticketId }),
      });
      if (res.ok) fetchTickets();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Complete': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Closed': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Missed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
          <button 
            onClick={() => { localStorage.removeItem('tutorToken'); navigate('/login'); }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
          >
            Log Out
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading tickets...</p>}
        {!loading && tickets.length === 0 && (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">No tickets found.</div>
        )}

        {/* Ticket List - Using a detailed card layout */}
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                    </span>
                    <span className="font-semibold text-gray-700">{ticket.studentName}</span>
                    <span className="text-gray-400 text-sm">for {ticket.className}</span>
                </div>
                <div className="text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">The Problem</h4>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded">{ticket.problem}</p>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Steps Taken</h4>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded">{ticket.stepsTaken}</p>
                </div>
              </div>

              {/* Card Footer: Tutor Actions */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                 <div className="text-sm">
                    {ticket.notes && (
                        <span className="text-gray-600"><strong>Notes:</strong> {ticket.notes}</span>
                    )}
                 </div>
                 
                 <div>
                    {ticket.status === 'New' ? (
                        <button 
                            onClick={() => handleClaim(ticket._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                        >
                            Claim Ticket
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                             <span className="text-sm text-gray-500 italic">
                                Claimed by {ticket.claimedBy || 'Unknown'}
                            </span>
                            {/* We can add buttons here later to mark as Complete/Closed */}
                        </div>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}