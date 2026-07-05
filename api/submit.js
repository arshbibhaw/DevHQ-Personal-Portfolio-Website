const https = require('https');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    const availableKeys = Object.keys(process.env).join(', ');
    return res.status(500).json({ 
      message: 'Server Configuration Error: Missing API Key',
      debug_available_env_keys: availableKeys
    });
  }

  try {
    const payload = JSON.stringify({
      ...req.body,
      access_key: accessKey,
    });

    const options = {
      hostname: 'api.web3forms.com',
      path: '/submit',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const data = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => body += chunk);
        response.on('end', () => {
          try {
            resolve({ status: response.statusCode, data: JSON.parse(body) });
          } catch (e) {
            reject(new Error('Failed to parse response JSON'));
          }
        });
      });

      request.on('error', (e) => reject(e));
      request.write(payload);
      request.end();
    });

    if (data.status === 200) {
      return res.status(200).json(data.data);
    } else {
      return res.status(data.status).json(data.data);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    return res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.toString()
    });
  }
};
