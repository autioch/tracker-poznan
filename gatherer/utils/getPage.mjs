import https from 'https';

export default function getPage(url) {
  let content = '';

  return new Promise((res) => {
    const req = https.get(url, (resp) => {
      resp.setEncoding('utf8');
      resp.on('data', (chunk) => {
        content += chunk;
      });

      resp.on('end', () => res(content));
    });

    req.end();
  });
}
