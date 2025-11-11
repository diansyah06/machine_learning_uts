'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const util = require('util');
const execAsync = util.promisify(exec);

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5623, // Ambil port dari Render, atau 5623 jika lokal
    host: '0.0.0.0', // Dengarkan di semua interface, BUKAN localhost
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      },
      payload: {
        maxBytes: 10 * 1024 * 1024, // 10MB max file size
        multipart: true
      }
    }
  });

  // Load plugin Inert untuk serving file statis
  await server.register(Inert);

  // Route halaman utama
  server.route({
    method: 'GET',
    path: '/',
    handler: {
      file: 'index.html'
    }
  });

  // Route statis (CSS, JS, dll)
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        index: false
      }
    }
  });

  // Route API prediksi
  server.route(require('./routes/predict'));

  await server.start();
  console.log('✅ Server running at:', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
