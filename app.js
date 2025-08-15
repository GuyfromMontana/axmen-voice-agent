import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// If "type": "module" in package.json — use ES Module imports:
import express from 'express';
import 'dotenv/config'; // If you use a .env file, or handle yourself
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client setup
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Security: Secret for webhook-auth (set in .env or host console)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'test_secret';

// Enable JSON body parsing
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', time: new Date().toISOString() });
});

// Handle webhook from Vapi (or other agent platform)
app.post('/vapi-webhook', async (req, res) => {
  // Security check
  if (req.headers['x-vapi-secret'] !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Extract info from request (customize as needed per agent platform!)
    const { session_id, user_name, user_phone, message, callback_requested } = req.body;

    // Save chat session if new
    // If session_id does NOT exist in chat_sessions, create it
    if (session_id && user_name) {
      await supabase
        .from('chat_sessions')
        .upsert([
          { id: session_id, user_name, user_phone, started_at: new Date(), status: callback_requested ? 'callback_requested' : 'active' }
        ]);
    }

    // Save chat message (could be from user or agent)
    if (session_id && message) {
      await supabase
        .from('chat_messages')
        .insert([
          { session_id, message, sender: 'user', is_voice: true, timestamp: new Date() }
        ]);
    }

    // Optionally, save callback request (if present)
    if (callback_requested && session_id) {
      await supabase
        .from('chat_sessions')
        .update({ status: 'callback_requested' })
        .eq('id', session_id);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Webhook save error:', err);
    res.status(500).json({ error: err.message });
  }
});

// You can add more endpoints below: e.g. callback queue, pricing updates, reporting...

app.listen(PORT, () => {
  console.log(`🎉 Axmen Recycling Phone Agent Server running on port ${PORT}`);
});
