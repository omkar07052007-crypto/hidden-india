// Vercel serverless endpoint for the Hidden India feedback demo.
// Vercel Functions have a read-only filesystem, so this endpoint validates
// submissions but does not claim to store them permanently.
module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const data = req.body || {};
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const message = String(data.message || '').trim();

  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160 || message.length < 10 || message.length > 2000) {
    return res.status(400).json({ error: 'Please provide a valid name, email and feedback message.' });
  }

  return res.status(200).json({
    message: 'Thanks! Your feedback passed validation. This Vercel demo does not permanently store submissions.'
  });
};
