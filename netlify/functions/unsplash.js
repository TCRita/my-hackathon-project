const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const { query } = event.queryStringParameters;
    
    // Netlifyの環境変数からカンマ区切りのAPIキー文字列を取得
    const API_KEYS_STRING = process.env.UNSPLASH_API_KEY;

    if (!API_KEYS_STRING) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'APIキーがサーバーに設定されていません。' })
        };
    }

    // カンマで分割してキーの配列を作成
    const apiKeys = API_KEYS_STRING.split(',');
    
    // 配列からランダムに1つのキーを選択
    const randomApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    
    const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${randomApiKey}`;

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