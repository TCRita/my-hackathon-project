const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const { query } = event.queryStringParameters;
    const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;

    if (!UNSPLASH_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'APIキーがサーバーに設定されていません。' })
        };
    }
    
    const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Unsplash APIエラー: ${response.status}, ${data.errors ? data.errors.join(', ') : 'Unknown error'}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};