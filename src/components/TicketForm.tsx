import { useState } from 'react';
import type { FormEvent } from 'react';

export default function TicketForm() {
  // State for all the new fields
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [problem, setProblem] = useState('');
  const [stepsTaken, setStepsTaken] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const payload = {
      studentName: name,
      className: className,
      problem: problem,
      stepsTaken: stepsTaken
    };

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage('Success! You are in the queue.');
        // Clear form
        setName('');
        setClassName('');
        setProblem('');
        setStepsTaken('');
      } else {
        setMessage('Error: Could not submit ticket.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error: Something went wrong.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Get Help</h2>
      
      {message && (
        <div className={`p-3 mb-6 rounded ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Row 1: Name and Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Class (e.g. CS 141)</label>
            <input
              type="text"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Class Name"
            />
          </div>
        </div>

        {/* Row 2: Problem Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">What problem do you need help with?</label>
          <textarea
            required
            rows={3}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Describe the bug or concept..."
          />
        </div>

        {/* Row 3: Steps Taken */}
        <div>
          <label className="block text-sm font-medium text-gray-700">What steps have you taken to solve it?</label>
          <textarea
            required
            rows={3}
            value={stepsTaken}
            onChange={(e) => setStepsTaken(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="I tried debugging using..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md shadow text-white font-medium transition duration-200
            ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Submitting...' : 'Join Queue'}
        </button>
      </form>
    </div>
  );
}