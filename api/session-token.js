module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.anam.ai/v1/auth/session-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ANAM_API_KEY}`,
      },
      body: JSON.stringify({
        personaConfig: {
          name: 'De Stille Telefoon',
          avatarId: process.env.ANAM_AVATAR_ID || '30fa96d0-26c4-4e55-94a0-517025942e18',
          voiceId: process.env.ANAM_VOICE_ID || '6bfbe25a-979d-40f3-a92b-5394170af54b',
          llmId: 'CUSTOMER_CLIENT_V1',
          languageCode: 'nl',
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anam fout:', err);
      return res.status(500).json({ error: 'Sessie mislukt' });
    }

    const data = await response.json();
    res.json({ sessionToken: data.sessionToken });
  } catch (error) {
    console.error('Sessie-fout:', error);
    res.status(500).json({ error: 'Sessie mislukt' });
  }
};
