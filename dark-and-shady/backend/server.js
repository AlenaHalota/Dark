const http = require('http');
const { handler: moviesHandler } = require('./src/handlers/movies');
const { handler: searchHandler } = require('./src/handlers/search');

const port = process.env.PORT || 3000;

function createEvent(req, body) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  return {
    httpMethod: req.method,
    path: url.pathname,
    queryStringParameters: Object.fromEntries(url.searchParams.entries()),
    headers: req.headers,
    requestContext: {
      http: {
        method: req.method,
        path: url.pathname,
      },
    },
    body,
    isBase64Encoded: false,
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(JSON.stringify(payload));
}

function parseResponseBody(result) {
  if (!result || result.body == null) return {};
  if (typeof result.body === 'string') {
    try {
      return JSON.parse(result.body);
    } catch {
      return { message: result.body };
    }
  }
  return result.body;
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname;

  if (path === '/health') {
    return sendJson(res, 200, { status: 'ok' });
  }

  const handleRequest = async (bodyPayload) => {
    const event = createEvent(req, bodyPayload);

    try {
      let result;

      if (path === '/movies') {
        result = await moviesHandler(event);
      } else if (path === '/search') {
        result = await searchHandler(event);
      } else {
        return sendJson(res, 404, { error: 'Not found' });
      }

      return sendJson(res, result.statusCode || 200, parseResponseBody(result));
    } catch (error) {
      console.error('Server error:', error);
      return sendJson(res, 500, { error: 'Internal server error' });
    }
  };

  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      handleRequest(body || null);
    });
    req.on('error', (err) => {
      console.error('Request parsing error:', err);
      sendJson(res, 400, { error: 'Bad request' });
    });
    return;
  }

  handleRequest(null);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Backend local server listening on http://0.0.0.0:${port}`);
});