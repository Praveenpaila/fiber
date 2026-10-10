const http = require('http');

const endpoints = [
  // Client Pages
  'http://localhost:5173/',
  'http://localhost:5173/privacy',
  'http://localhost:5173/terms',
  'http://localhost:5173/credits',
  'http://localhost:5173/not-found-test',

  // Static Assets
  'http://localhost:5173/favicon.ico',
  'http://localhost:5173/favicon.svg',
  'http://localhost:5173/apple-touch-icon.png',
  'http://localhost:5173/site.webmanifest',
  'http://localhost:5173/robots.txt',
  'http://localhost:5173/sitemap.xml',
  'http://localhost:5173/images/fiber_cross_section.svg',
  'http://localhost:5173/images/setup_diagram.svg',
  'http://localhost:5173/images/telecom_fiber.svg',
  'http://localhost:5173/images/endoscopy_scope.svg',
  'http://localhost:5173/images/fiber_sensor.svg',
  'http://localhost:5173/images/aerospace_fiber.svg',
  'http://localhost:5173/images/decorative_fiber.svg',
  'http://localhost:5173/images/industrial_fiber.svg',

  // Backend API Endpoints
  'http://localhost:5000/api/health',
  'http://localhost:5000/api/apparatus',
  'http://localhost:5000/api/procedure',
  'http://localhost:5000/api/precautions',
  'http://localhost:5000/api/applications',
  'http://localhost:5000/api/quiz',
  'http://localhost:5000/api/observations'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
    }).on('error', (err) => {
      resolve({ url, status: 0, ok: false, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing all endpoints and static assets...');
  const results = await Promise.all(endpoints.map(checkUrl));
  let allPassed = true;

  results.forEach(r => {
    if (r.ok) {
      console.log(`[PASS] ${r.status} ${r.url}`);
    } else {
      console.error(`[FAIL] ${r.status} ${r.url} - ${r.error || 'Non-200 status'}`);
      allPassed = false;
    }
  });

  if (allPassed) {
    console.log('\nAll 25 endpoints and assets verified successfully with HTTP 200 OK!');
    process.exit(0);
  } else {
    console.error('\nSome endpoints failed verification.');
    process.exit(1);
  }
}

run();
