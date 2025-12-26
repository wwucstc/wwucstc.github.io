import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // SAVE THE TOKEN! This is crucial.
        localStorage.setItem('tutorToken', data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
        console.error(err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow-md border">
      <h2 className="text-xl font-bold mb-4">Tutor Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <input 
          type="text" 
          placeholder="Username" 
          className="w-full p-2 border rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Log In
        </button>
      </form>
    </div>
  );
}