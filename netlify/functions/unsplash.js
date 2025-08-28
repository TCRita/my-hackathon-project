const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    // フロントエンドから 'query' と 'keyIndex' を受け取る
    const { query, keyIndex } = event.queryStringParameters;
    const index = parseInt(keyIndex || "0", 10); // keyIndexがなければ0番目とする

    const API_KEYS_STRING = process.env.UNSPLASH_API_KEY;

    if (!API_KEYS_STRING) {
        return { statusCode: 500, body: JSON.stringify({ error: 'APIキーがサーバーに設定されていません。' }) };
    }

    const apiKeys = API_KEYS_STRING.split(',');

    // 指定されたインデックスのキーが存在するかチェック
    if (index >= apiKeys.length) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'all_keys_exhausted', message: 'すべてのAPIキーが利用上限に達した可能性があります。' })
        };
    }

    const apiKeyToTry = apiKeys[index];
    const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${apiKeyToTry}`;

    try {
        const response = await fetch(apiUrl);

        // レート制限（403 Forbidden）を検知
        if (response.status === 403) {
            console.warn(`APIキー ${index + 1} がレート制限です。`);
            return {
                statusCode: 429, // 429 Too Many Requests エラーを返す
                body: JSON.stringify({ error: 'rate_limit_exceeded', message: `キー ${index + 1} は利用上限です。` })
            };
        }
        
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
            statusCode: 502,
            body: JSON.stringify({ error: error.message })
        };
    }
};