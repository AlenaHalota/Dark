const { DynamoDBClient, ScanCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const mockMovies = require('./mockMovies');

let client = null;
const tableName = process.env.MOVIES_TABLE || process.env.DYNAMODB_TABLE;

function getClient() {
  if (!client) {
    client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
  }
  return client;
}

async function fetchMoviesFromDynamo() {
  const client = getClient();
  const response = await client.send(new ScanCommand({ TableName: tableName }));
  const items = response.Items || [];

  return items.map((item) => ({
    id: item.id?.S,
    title: item.title?.S,
    subGenre: item.subGenre?.S,
    releaseYear: item.releaseYear?.N ? Number(item.releaseYear.N) : undefined,
    director: item.director?.S,
    cast: item.cast?.L?.map((entry) => entry.S).filter(Boolean) || [],
    rating: item.rating?.N ? Number(item.rating.N) : undefined,
    review: item.review?.S,
  }));
}

async function fetchMovies() {
  if (!tableName) {
    return mockMovies;
  }

  try {
    return await fetchMoviesFromDynamo();
  } catch (error) {
    console.error('DynamoDB fetch failed:', error);
    return mockMovies;
  }
}

function searchLocalMovies(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return mockMovies;
  }

  return mockMovies.filter((movie) => {
    return (
      movie.title.toLowerCase().includes(normalized) ||
      movie.director.toLowerCase().includes(normalized) ||
      movie.subGenre.toLowerCase().includes(normalized) ||
      movie.review.toLowerCase().includes(normalized) ||
      movie.cast.some((name) => name.toLowerCase().includes(normalized))
    );
  });
}

async function searchMovies(query) {
  if (!query || !query.trim()) {
    return fetchMovies();
  }

  if (!tableName) {
    return searchLocalMovies(query);
  }

  try {
    const client = getClient();
    const params = {
      TableName: tableName,
      FilterExpression:
        'contains(#title, :term) OR contains(#director, :term) OR contains(#subGenre, :term) OR contains(#review, :term)',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#director': 'director',
        '#subGenre': 'subGenre',
        '#review': 'review',
      },
      ExpressionAttributeValues: {
        ':term': { S: query.trim() },
      },
    };
    const response = await client.send(new ScanCommand(params));
    const items = response.Items || [];

    return items.map((item) => ({
      id: item.id?.S,
      title: item.title?.S,
      subGenre: item.subGenre?.S,
      releaseYear: item.releaseYear?.N ? Number(item.releaseYear.N) : undefined,
      director: item.director?.S,
      cast: item.cast?.L?.map((entry) => entry.S).filter(Boolean) || [],
      rating: item.rating?.N ? Number(item.rating.N) : undefined,
      review: item.review?.S,
    }));
  } catch (error) {
    console.error('DynamoDB search failed:', error);
    return searchLocalMovies(query);
  }
}

async function createMovie(movie) {
  const normalized = {
    id: movie.id || (typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `movie-${Date.now()}`),
    title: movie.title || '',
    subGenre: movie.subGenre || '',
    releaseYear: Number(movie.releaseYear) || undefined,
    director: movie.director || '',
    cast: Array.isArray(movie.cast) ? movie.cast : [],
    rating: movie.rating !== undefined ? Number(movie.rating) : undefined,
    review: movie.review || '',
  };

  const item = {
    id: { S: normalized.id },
    title: { S: normalized.title },
    subGenre: { S: normalized.subGenre },
    director: { S: normalized.director },
    review: { S: normalized.review },
  };

  if (normalized.releaseYear !== undefined) {
    item.releaseYear = { N: String(normalized.releaseYear) };
  }
  if (normalized.rating !== undefined) {
    item.rating = { N: String(normalized.rating) };
  }
  if (normalized.cast.length > 0) {
    item.cast = { L: normalized.cast.map((member) => ({ S: member })) };
  }

  if (!tableName) {
    mockMovies.push(normalized);
    return normalized;
  }

  try {
    const client = getClient();
    await client.send(new PutItemCommand({ TableName: tableName, Item: item }));
    return normalized;
  } catch (error) {
    console.error('DynamoDB create failed:', error);
    mockMovies.push(normalized);
    return normalized;
  }
}

module.exports = { fetchMovies, searchMovies, createMovie };
