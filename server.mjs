import { createServer } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const primaryRoot = path.join(__dirname, 'dist');
const fallbackRoot = path.join(__dirname, 'src');
const root = existsSync(primaryRoot) ? primaryRoot : fallbackRoot;
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(message);
}

const server = createServer(async (request, response) => {
  let pathname;

  try {
    pathname = new URL(request.url || '/', 'http://localhost').pathname;
  } catch {
    sendText(response, 400, 'Bad request');
    return;
  }

  const requestPath = pathname === '/' ? '/index.html' : pathname;
  const safePath = path.normalize(requestPath).replace(/^[/\\]+/, '');
  const filePath = path.resolve(root, safePath);
  const relativePath = path.relative(root, filePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    sendText(response, 403, 'Forbidden');
    return;
  }

  try {
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) {
      sendText(response, 404, 'Not found');
      return;
    }

    const extension = path.extname(filePath);
    const stream = createReadStream(filePath);
    stream.on('open', () => {
      response.writeHead(200, {
        'Content-Type': contentTypes[extension] ?? 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff'
      });
      stream.pipe(response);
    });
    stream.on('error', () => {
      if (response.headersSent) {
        response.destroy();
        return;
      }

      sendText(response, 500, 'Unable to read file');
    });
  } catch {
    sendText(response, 404, 'Not found');
  }
});

server.listen(port, () => {
  console.log(`PureEssence is running on http://localhost:${port}`);
});
