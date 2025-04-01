import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import Fastify from 'fastify';
import appRoot from '../src/app.js'; // adapte ce chemin si besoin

export const buildApp = async () => {
  const dbFileName = `test-${randomUUID()}.db`;
  const TEST_DATABASE_URL = `file:./${dbFileName}`;

  execSync('npx prisma migrate reset --force --skip-seed', {
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: 'inherit',
  });

  const app = Fastify();
  app.register(appRoot);
  app.decorate('testDbUrl', TEST_DATABASE_URL);

  await app.ready();
  return app;
};

export const closeApp = async (app) => {
  if (app) await app.close();
};
