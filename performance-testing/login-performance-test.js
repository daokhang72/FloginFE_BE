import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");

// Test configuration
export const options = {
  stages: [
    // Smoke test
    { duration: "30s", target: 2 },

    // Load test - 100 users
    { duration: "1m", target: 100 },
    { duration: "2m", target: 100 },

    // Load test - 500 users
    { duration: "1m", target: 500 },
    { duration: "2m", target: 500 },

    // Load test - 1000 users
    { duration: "1m", target: 1000 },
    { duration: "2m", target: 1000 },

    // Ramp down
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    // 95% of requests should complete within 500ms
    http_req_duration: ["p(95)<500"],
    // Error rate should be less than 1%
    errors: ["rate<0.01"],
  },
};

const BASE_URL = "http://localhost:8080";

// Test data
const testUsers = [
  { username: "testuser1", password: "password123" },
  { username: "testuser2", password: "password123" },
  { username: "admin", password: "admin123" },
];

export function setup() {
  // Register test users if needed
  testUsers.forEach((user) => {
    const registerPayload = JSON.stringify({
      username: user.username,
      password: user.password,
      email: `${user.username}@test.com`,
    });

    const registerParams = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Try to register (ignore if already exists)
    http.post(`${BASE_URL}/api/auth/register`, registerPayload, registerParams);
  });

  console.log("Setup completed - test users registered");
}

export default function () {
  // Select random test user
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];

  const loginPayload = JSON.stringify({
    username: user.username,
    password: user.password,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    tags: { name: "LoginAPI" },
  };

  // Perform login request
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    loginPayload,
    params
  );

  // Check response
  const loginSuccess = check(loginRes, {
    "status is 200": (r) => r.status === 200,
    "response has token": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.token !== undefined;
      } catch (e) {
        return false;
      }
    },
    "response time < 500ms": (r) => r.timings.duration < 500,
  });

  errorRate.add(!loginSuccess);

  // Random think time between 1-3 seconds
  sleep(Math.random() * 2 + 1);
}

export function teardown(data) {
  console.log("Performance test completed");
}

// Summary handler
export function handleSummary(data) {
  return {
    "login-performance-results.json": JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = options.indent || "";
  let output = "\n" + indent + "=== Login API Performance Test Summary ===\n\n";

  if (data.metrics.http_req_duration) {
    output += indent + "Response Time:\n";
    output +=
      indent +
      `  avg: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
    output +=
      indent +
      `  min: ${data.metrics.http_req_duration.values.min.toFixed(2)}ms\n`;
    output +=
      indent +
      `  max: ${data.metrics.http_req_duration.values.max.toFixed(2)}ms\n`;
    output +=
      indent +
      `  p(90): ${data.metrics.http_req_duration.values["p(90)"].toFixed(
        2
      )}ms\n`;
    output +=
      indent +
      `  p(95): ${data.metrics.http_req_duration.values["p(95)"].toFixed(
        2
      )}ms\n\n`;
  }

  if (data.metrics.http_reqs) {
    output +=
      indent + `Total Requests: ${data.metrics.http_reqs.values.count}\n`;
    output +=
      indent +
      `Requests/sec: ${data.metrics.http_reqs.values.rate.toFixed(2)}\n\n`;
  }

  if (data.metrics.errors) {
    output +=
      indent +
      `Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%\n\n`;
  }

  return output;
}
