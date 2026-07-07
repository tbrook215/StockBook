const https = require('https');

exports.handler = async (event) => {
  const { code, market } = event.queryStringParameters || {};

  if (!code || !market) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Missing code or market' }),
    };
  }

  const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${market}_${code}.tw&json=1&delay=0`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: data,
        });
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: err.message }),
      });
    });
  });
};
