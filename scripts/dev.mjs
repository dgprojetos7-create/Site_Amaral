import { spawn } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const viteArgs = process.argv.slice(2);
const children = new Set();
let shuttingDown = false;

const spawnProcess = (label, args) => {
  const child = spawn(npmCommand, args, {
    stdio: 'inherit',
    env: process.env,
  });

  children.add(child);

  child.on('exit', (code, signal) => {
    children.delete(child);

    if (shuttingDown) {
      return;
    }

    shuttingDown = true;

    for (const runningChild of children) {
      runningChild.kill('SIGTERM');
    }

    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });

  child.on('error', (error) => {
    console.error(`[${label}]`, error);
  });

  return child;
};

spawnProcess('client', ['run', 'dev:client', '--', ...viteArgs]);
spawnProcess('server', ['run', 'dev:server']);

const shutdown = () => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    child.kill('SIGTERM');
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
