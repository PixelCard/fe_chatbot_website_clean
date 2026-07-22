const net = require('node:net');
const { execFileSync, spawn } = require('node:child_process');

const DEFAULT_PORT = Number.parseInt(process.env.PORT ?? '5000', 10);
const HOST = process.env.HOST;

function isUsablePort(port) {
  return Number.isInteger(port) && port > 0 && port < 65536;
}

function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      const server = net.createServer();

      server.unref();
      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          tryPort(port + 1);
          return;
        }

        reject(error);
      });

      const listenOptions = HOST ? { host: HOST, port } : { port };

      server.listen(listenOptions, () => {
        const { port: freePort } = server.address();
        server.close(() => resolve(freePort));
      });
    };

    tryPort(startPort);
  });
}

function stopProcessTree(pid) {
  if (!Number.isInteger(pid)) {
    return;
  }

  execFileSync('taskkill', ['/PID', String(pid), '/T', '/F'], {
    stdio: 'ignore',
  });
}

function getExistingServerPid(output) {
  if (!output.includes('Another next dev server is already running.')) {
    return null;
  }

  const match = output.match(/PID:\s+(\d+)/);
  if (!match) {
    return null;
  }

  const pid = Number.parseInt(match[1], 10);
  return Number.isInteger(pid) ? pid : null;
}

async function startNextDev(retryOnExistingServer) {
  const preferredPort = isUsablePort(DEFAULT_PORT) ? DEFAULT_PORT : 5000;
  const port = await findAvailablePort(preferredPort);
  const nextBin = require.resolve('next/dist/bin/next');
  const args = [nextBin, 'dev', '--turbopack', '-p', String(port)];

  if (HOST) {
    args.push('--hostname', HOST);
  }

  if (port !== preferredPort) {
    console.log(
      `[dev] Port ${preferredPort} is in use. Starting Next.js on port ${port} instead.`
    );
  }

  const child = spawn(process.execPath, args, {
    stdio: ['inherit', 'pipe', 'pipe'],
    env: {
      ...process.env,
      PORT: String(port),
    },
  });

  let stderrOutput = '';

  child.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  child.stderr.on('data', (chunk) => {
    const text = chunk.toString();
    stderrOutput += text;
    process.stderr.write(chunk);
  });

  child.on('exit', async (code, signal) => {
    const existingServerPid = getExistingServerPid(stderrOutput);

    if (retryOnExistingServer && existingServerPid) {
      console.log(`[dev] Stopping stale Next.js dev server: ${existingServerPid}`);
      stopProcessTree(existingServerPid);
      await startNextDev(false);
      return;
    }

    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

startNextDev(true).catch((error) => {
  console.error('[dev] Failed to start Next.js:', error);
  process.exit(1);
});
