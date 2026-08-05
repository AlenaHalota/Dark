const { searchMovies } = require('../lib/dynamo');

exports.handler = async (event) => {
  const q = event.queryStringParameters && event.queryStringParameters.q;

  try {
    const movies = await searchMovies(q || '');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ movies }),
    };
  } catch (error) {
    console.error('search handler error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Unable to search movies' }),
    };
  }
};
