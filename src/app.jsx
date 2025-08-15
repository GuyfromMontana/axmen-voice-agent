
import { useState, useEffect } from 'react';
import supabase from './lib/supabaseClient'; // Adjust import path if needed

export default function App() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchSessions() {
      const { data, error } = await supabase.from('chat_sessions').select('*');
      if (error) {
        console.error('Supabase error:', error.message);
      } else {
        setSessions(data);
      }
    }
    fetchSessions();
  }, []);

  return (
    <div>
      <h1>Axmen Recycling React + Supabase!</h1>
      <pre>{JSON.stringify(sessions, null, 2)}</pre>
    </div>
  );
}
