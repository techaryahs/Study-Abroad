const http = require('http');

const data = JSON.stringify({
  name: "Partner Test Mobile Dup",
  email: "partner-test-unique-mobile-dup-2026@example.com",
  mobile: "9998887771", // Same mobile as before
  password: "Test123456",
  partnerType: "edu_leader",
  organizationName: "Test Education Group",
  organizationEmail: "contact-mobile-dup-2026@example.com",
  organizationPhone: "1234567890",
  designation: "CEO"
});

const options = {
  hostname: 'localhost',
  port: 5011,
  path: '/api/auth/register-partner',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
