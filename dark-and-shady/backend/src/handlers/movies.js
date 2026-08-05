const { fetchMovies, createMovie } = require('../lib/dynamo');

function getHttpMethod(event) {
  return event.httpMethod || event.requestContext?.http?.method || 'GET';
}

exports.handler = async (event) => {
  const method = getHttpMethod(event).toUpperCase();

  if (method === 'POST') {
    let input = {}
    try {
      input = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {}
    } catch (error) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid JSON payload' }),
      }
    }

    try {
      const movie = await createMovie(input)
      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ movie }),
      }
    } catch (error) {
      console.error('create movie error:', error)
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Unable to create movie' }),
      }
    }
  }

  try {
    const movies = await fetchMovies();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ movies }),
    }
  } catch (error) {
    console.error('movies handler error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Unable to load movies' }),
    };
  }
};
