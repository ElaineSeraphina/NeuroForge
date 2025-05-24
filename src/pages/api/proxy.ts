import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { protocol, origin, path, headers, method, body: proxyBody } = req.body;
    const url = `${protocol}://${origin}${path}`;

    const proxyRes = await fetch(url, {
      method,
      headers,
      body: proxyBody,
    });

    const contentType = proxyRes.headers.get('content-type');
    res.setHeader('content-type', contentType || 'application/json');

    if (contentType && contentType.includes('application/json')) {
      const data = await proxyRes.json();
      res.status(proxyRes.status).json(data);
    } else {
      const text = await proxyRes.text();
      res.status(proxyRes.status).send(text);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}