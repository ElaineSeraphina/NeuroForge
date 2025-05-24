import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { protocol, origin, path, headers = {}, method, body: proxyBody } = body;
  const url = `${protocol}://${origin}${path}`;

  // Inject FAL.ai API key jika ke fal.run
  if (origin === "fal.run") {
    headers['Authorization'] = `Key ${process.env.FAL_KEY}`;
  }

  const proxyRes = await fetch(url, {
    method,
    headers,
    body: proxyBody,
  });

  const contentType = proxyRes.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await proxyRes.json();
    // Log response for debugging
    console.log('FAL.ai response:', JSON.stringify(data));
    return NextResponse.json(data, { status: proxyRes.status });
  } else {
    data = await proxyRes.text();
    // Log raw response for debugging
    console.error('FAL.ai non-JSON response:', data);
    return new NextResponse(data, {
      status: proxyRes.status,
      headers: { 'content-type': contentType || 'text/plain' }
    });
  }
}