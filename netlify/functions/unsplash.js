const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    let { query } = event.queryStringParameters;
    const API_KEYS_STRING = process.env.UNSPLASH_API_KEY;

    if (!API_KEYS_STRING) {
        return { statusCode: 500, body: JSON.stringify({ error: 'APIキーがサーバーに設定されていません。' }) };
    }

    const apiKeys = API_KEYS_STRING.split(',');
    const randomApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    
    let apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${randomApiKey}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        // ★★★ もし写真が見つからなかった場合の再検索ロジック ★★★
        if (!data.urls) {
            console.warn(`キーワード "${query}" で画像が見つかりませんでした。より単純なキーワードで再検索します。`);
            // キーワードを最初の1つに絞って再検索
            const simplerQuery = query.split(',')[0];
            apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(simplerQuery)}&orientation=landscape&client_id=${randomApiKey}`;
            
            response = await fetch(apiUrl);
            data = await response.json();

            // それでも見つからない場合はエラー
            if (!data.urls) {
                throw new Error(`再検索でも画像が見つかりませんでした: ${simplerQuery}`);
            }
        }
        // ★★★ 修正はここまで ★★★

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