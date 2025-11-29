import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");

// Spike Test Configuration - Test sudden traffic spikes
export const options = {
  stages: [
    // Normal load
    { duration: "30s", target: 100 },

    // SPIKE 1: Sudden increase
    { duration: "10s", target: 2000 },
    { duration: "1m", target: 2000 },
    { duration: "10s", target: 100 },

    // Recovery period
    { duration: "1m", target: 100 },

    // SPIKE 2: Even bigger spike
    { duration: "10s", target: 3000 },
    { duration: "1m", target: 3000 },
    { duration: "10s", target: 100 },

    // Final recovery
    { duration: "1m", target: 100 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<1500"],
    errors: ["rate<0.15"], // Allow up to 15% errors during spikes
  },
};

const BASE_URL = "http://localhost:8080";

const testUsers = [
  { username: "testuser1", password: "password123" },
  { username: "testuser2", password: "password123" },
  { username: "admin", password: "admin123" },
];

export function setup() {
  console.log("Starting SPIKE TEST - Testing sudden load increases...");

  // Register test users
  testUsers.forEach((user) => {
    const registerPayload = JSON.stringify({
      username: user.username,
      password: user.password,
      email: `${user.username}@test.com`,
    });

    const registerParams = {
      headers: { "Content-Type": "application/json" },
    };

    http.post(`${BASE_URL}/api/auth/register`, registerPayload, registerParams);
  });

  return { startTime: Date.now() };
}

export default function (data) {
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];

  // Realistic user behavior during spike
  const scenario = Math.random();

  if (scenario < 0.5) {
    // 50% - Login attempts (common during traffic spikes)
    const loginPayload = JSON.stringify({
      username: user.username,
      password: user.password,
    });

    const params = {
      headers: { "Content-Type": "application/json" },
      tags: { operation: "login", test_type: "spike" },
    };

    const res = http.post(`${BASE_URL}/api/auth/login`, loginPayload, params);

    const success = check(res, {
      "login successful": (r) => r.status === 200,
      "response time acceptable": (r) => r.timings.duration < 2000,
    });

    errorRate.add(!success);
  } else if (scenario < 0.85) {
    // 35% - Browse products
    const params = {
      tags: { operation: "get_products", test_type: "spike" },
    };

    const res = http.get(`${BASE_URL}/api/products`, params);

    const success = check(res, {
      "products loaded": (r) => r.status === 200,
      "response time acceptable": (r) => r.timings.duration < 1000,
    });

    errorRate.add(!success);
  } else {
    // 15% - View specific product
    const productId = Math.floor(Math.random() * 10) + 1;
    const params = {
      tags: { operation: "get_product", test_type: "spike" },
    };

    const res = http.get(`${BASE_URL}/api/products/${productId}`, params);

    const success = check(res, {
      "product loaded": (r) => r.status === 200 || r.status === 404,
      "response time acceptable": (r) => r.timings.duration < 800,
    });

    errorRate.add(!success && res.status !== 404);
  }

  // Minimal think time during spike
  sleep(Math.random() * 0.3);
}

export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`Spike test completed in ${duration.toFixed(2)} seconds`);
}

export function handleSummary(data) {
  return {
    "spike-test-results.json": JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = options.indent || "";
  let output = "\n" + indent + "=== SPIKE TEST Summary ===\n\n";

  output += indent + "Test simulated 2 sudden traffic spikes:\n";
  output += indent + "  Spike 1: 100 → 2000 users in 10s\n";
  output += indent + "  Spike 2: 100 → 3000 users in 10s\n\n";

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
      )}ms\n`;
    output +=
      indent +
      `  p(99): ${data.metrics.http_req_duration.values["p(99)"].toFixed(
        2
      )}ms\n\n`;
  }

  if (data.metrics.http_reqs) {
    output +=
      indent + `Total Requests: ${data.metrics.http_reqs.values.count}\n`;
    output +=
      indent +
      `Peak Requests/sec: ${data.metrics.http_reqs.values.rate.toFixed(2)}\n\n`;
  }

  if (data.metrics.errors) {
    output +=
      indent +
      `Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%\n\n`;
  }

  output += indent + "=== Recovery Analysis ===\n";
  if (data.metrics.errors && data.metrics.errors.values.rate < 0.05) {
    output += indent + "✓ System recovered well from spikes\n";
    output += indent + "✓ Error rate remained acceptable\n";
  } else if (data.metrics.errors && data.metrics.errors.values.rate < 0.15) {
    output += indent + "⚠ System struggled during spikes but recovered\n";
    output += indent + "⚠ Consider implementing rate limiting or caching\n";
  } else {
    output += indent + "✗ System failed to handle spikes gracefully\n";
    output += indent + "✗ Immediate optimization required\n";
  }

  return output;
}
