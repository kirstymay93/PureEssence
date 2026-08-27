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

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  const requestPath = pathname === '/' ? '/index.html' : pathname;
  const safePath = path.normalize(requestPath).replace(/^[/\\]+/, '');
  const filePath = path.resolve(root, safePath);
  const relativePath = path.relative(root, filePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  try {
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[extension] ?? 'application/octet-stream'
    });

    const stream = createReadStream(filePath);
    stream.on('error', () => {
      if (response.headersSent) {
        response.destroy();
        return;
      }

      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Unable to read file');
    });
    stream.pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`PureEssence is running on http://localhost:${port}`);
});
