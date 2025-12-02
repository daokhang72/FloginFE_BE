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
    // 95% of requests should complete within 300ms
    http_req_duration: ["p(95)<300"],
    // Error rate should be less than 1%
    errors: ["rate<0.01"],
  },
};

const BASE_URL = "http://localhost:8080";

// This will be populated dynamically in setup()
let VALID_PRODUCT_IDS = [];

// Helper function to get random valid product ID
function getRandomProductId() {
  if (VALID_PRODUCT_IDS.length === 0) {
    return 1; // Fallback
  }
  return VALID_PRODUCT_IDS[
    Math.floor(Math.random() * VALID_PRODUCT_IDS.length)
  ];
}

export function setup() {
  console.log("🔧 Setting up test - fetching actual product IDs from API...");

  // Login with one of the test users (testuser1-50)
  const randomUser = Math.floor(Math.random() * 50) + 1;
  const loginPayload = JSON.stringify({
    username: `testuser${randomUser}`,
    password: "password123",
  });

  const loginParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    loginPayload,
    loginParams
  );

  let token = null;
  if (loginRes.status === 200) {
    try {
      const body = JSON.parse(loginRes.body);
      token = body.token;
    } catch (e) {
      console.error("Failed to parse login response");
    }
  }

  // Fetch actual product IDs from API (with authentication)
  const productsParams = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
  const productsRes = http.get(`${BASE_URL}/api/products`, productsParams);
  const validProductIds = [];

  if (productsRes.status === 200) {
    try {
      const products = JSON.parse(productsRes.body);
      products.forEach((product) => {
        if (product.id) {
          validProductIds.push(product.id);
        }
      });
      console.log(
        `✅ Found ${
          validProductIds.length
        } valid product IDs: ${validProductIds.join(", ")}`
      );
    } catch (e) {
      console.error("Failed to parse products response");
    }
  } else {
    console.warn(
      `⚠️ Failed to fetch products (status ${productsRes.status}), using fallback IDs`
    );
  }

  return {
    token: token,
    productIds: validProductIds.length > 0 ? validProductIds : [1, 2, 3, 4, 5], // Fallback
  };
} 

export default function (data) {
  // Update global product IDs from setup data
  if (data.productIds && data.productIds.length > 0) {
    VALID_PRODUCT_IDS = data.productIds;
  }

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    tags: { name: "ProductAPI" },
  };

  // Add authorization if token available
  if (data.token) {
    params.headers["Authorization"] = `Bearer ${data.token}`;
  }

  // Scenario: Mix of different API calls
  // Focus on GET operations since POST/PUT require multipart/form-data with file upload
  const scenario = Math.random();

  if (scenario < 0.7) {
    // 70% - Get all products (increased from 50%)
    const res = http.get(`${BASE_URL}/api/products`, params);

    const success = check(res, {
      "status is 200": (r) => r.status === 200,
      "response is array": (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body);
        } catch (e) {
          return false;
        }
      },
      "response time < 300ms": (r) => r.timings.duration < 300,
    });

    errorRate.add(!success);
  } else {
    // 30% - Get single product (using valid product IDs from database, increased from 30%)
    const productId = getRandomProductId();
    const res = http.get(`${BASE_URL}/api/products/${productId}`, params);

    const success = check(res, {
      "status is 200": (r) => r.status === 200,
      "response time < 200ms": (r) => r.timings.duration < 200,
    });

    errorRate.add(!success);
  }

  // Note: POST/PUT operations skipped in this test as they require multipart/form-data
  // with file upload, which is complex in k6. This test focuses on read-heavy workload
  // which is typical for e-commerce product browsing.

  // Random think time between 0.5-2 seconds
  sleep(Math.random() * 1.5 + 0.5);
}

export function teardown(data) {
  console.log("Product API performance test completed");
}

// Summary handler
export function handleSummary(data) {
  return {
    "product-performance-results.json": JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = options.indent || "";
  let output =
    "\n" + indent + "=== Product API Performance Test Summary ===\n\n";

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
