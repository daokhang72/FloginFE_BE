import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");

// Stress Test Configuration - Tìm breaking point
export const options = {
  stages: [
    // Warm up
    { duration: "1m", target: 1000 },

    // Gradually increase load to find breaking point
    { duration: "1m", target: 3000 },
    { duration: "1m", target: 5000 },
    { duration: "1m", target: 7000 },
    { duration: "1m", target: 9000 },
    { duration: "1m", target: 11000 },

    // Hold at peak to observe system behavior
    { duration: "2m", target: 11000 },

    // Ramp down
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    // We expect some failures in stress test
    http_req_duration: ["p(95)<5000"], // Increased threshold
    errors: ["rate<0.2"], // Allow up to 20% errors to find true breaking point
  },
};

const BASE_URL = "http://localhost:8080";

const testUsers = [
  { username: "testuser1", password: "password123" },
  { username: "testuser2", password: "password123" },
  { username: "admin", password: "admin123" },
];

export function setup() {
  console.log("Starting STRESS TEST - Finding breaking point...");

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

  // Login to get token for fetching products
  const loginPayload = JSON.stringify({
    username: testUsers[0].username,
    password: testUsers[0].password,
  });

  const loginParams = {
    headers: { "Content-Type": "application/json" },
  };

  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    loginPayload,
    loginParams
  );

  if (loginRes.status !== 200) {
    throw new Error("Failed to login in setup");
  }

  const token = JSON.parse(loginRes.body).token;

  // Fetch all products to get valid IDs
  const productsParams = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const productsRes = http.get(`${BASE_URL}/api/products`, productsParams);

  if (productsRes.status !== 200) {
    throw new Error("Failed to fetch products in setup");
  }

  const products = JSON.parse(productsRes.body);
  const productIds = products.map((p) => p.id);

  console.log(
    `Found ${productIds.length} valid product IDs: ${productIds
      .slice(0, 5)
      .join(", ")}...`
  );

  return { timestamp: Date.now(), productIds: productIds, token: token };
}

export default function (data) {
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];
  const productIds = data.productIds || [];
  const token = data.token || "";

  // Mix of operations - READ operations only (realistic production traffic pattern)
  const operation = Math.random();

  if (operation < 0.3) {
    // 30% - Login
    const loginPayload = JSON.stringify({
      username: user.username,
      password: user.password,
    });

    const params = {
      headers: { "Content-Type": "application/json" },
      tags: { operation: "login" },
    };

    const res = http.post(`${BASE_URL}/api/auth/login`, loginPayload, params);

    const success = check(res, {
      "login status OK": (r) => r.status === 200,
      "has token": (r) => {
        try {
          return JSON.parse(r.body).token !== undefined;
        } catch (e) {
          return false;
        }
      },
    });

    errorRate.add(!success);
  } else if (operation < 0.7) {
    // 40% - Get all products
    const params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      tags: { operation: "get_products" },
    };

    const res = http.get(`${BASE_URL}/api/products`, params);

    const success = check(res, {
      "products status OK": (r) => r.status === 200,
    });

    errorRate.add(!success);
  } else {
    // 30% - Get single product by ID (using real product IDs)
    // Mô phỏng người dùng xem chi tiết sản phẩm - operation phổ biến nhất
    if (productIds.length > 0) {
      const productId =
        productIds[Math.floor(Math.random() * productIds.length)];
      const params = {
        headers: { Authorization: `Bearer ${token}` },
        tags: { operation: "get_product_detail" },
      };

      const res = http.get(`${BASE_URL}/api/products/${productId}`, params);

      const success = check(res, {
        "product detail status OK": (r) => r.status === 200,
        "has product data": (r) => {
          try {
            const product = JSON.parse(r.body);
            return (
              product.id !== undefined &&
              product.name !== undefined &&
              product.price !== undefined
            );
          } catch (e) {
            return false;
          }
        },
      });

      errorRate.add(!success);
    } else {
      // Fallback if no product IDs available
      const productId = Math.floor(Math.random() * 50) + 1;
      const params = {
        tags: { operation: "get_product_detail" },
      };

      const res = http.get(`${BASE_URL}/api/products/${productId}`, params);

      const success = check(res, {
        "product status OK or NOT FOUND": (r) =>
          r.status === 200 || r.status === 404,
      });

      errorRate.add(!success && res.status !== 404);
    }
  }

  // Very short think time to maximize stress
  sleep(Math.random() * 0.5);
}

export function teardown(data) {
  const duration = (Date.now() - data.timestamp) / 1000;
  console.log(`Stress test completed in ${duration.toFixed(2)} seconds`);
}

export function handleSummary(data) {
  let breakingPoint = "Not reached";

  // Try to determine breaking point from error rates
  if (data.metrics.errors && data.metrics.errors.values.rate > 0.05) {
    breakingPoint = `~${Math.floor(
      data.metrics.vus_max.values.max
    )} concurrent users`;
  }

  return {
    "stress-test-results.json": JSON.stringify(data, null, 2),
    stdout: textSummary(data, breakingPoint, {
      indent: " ",
      enableColors: true,
    }),
  };
}

function textSummary(data, breakingPoint, options) {
  const indent = options.indent || "";
  let output = "\n" + indent + "=== STRESS TEST Summary ===\n\n";

  output += indent + `Breaking Point: ${breakingPoint}\n\n`;

  if (data.metrics.http_req_duration) {
    output += indent + "Response Time:\n";
    output +=
      indent +
      `  avg: ${(data.metrics.http_req_duration.values.avg || 0).toFixed(
        2
      )}ms\n`;
    output +=
      indent +
      `  min: ${(data.metrics.http_req_duration.values.min || 0).toFixed(
        2
      )}ms\n`;
    output +=
      indent +
      `  max: ${(data.metrics.http_req_duration.values.max || 0).toFixed(
        2
      )}ms\n`;
    output +=
      indent +
      `  p(90): ${(data.metrics.http_req_duration.values["p(90)"] || 0).toFixed(
        2
      )}ms\n`;
    output +=
      indent +
      `  p(95): ${(data.metrics.http_req_duration.values["p(95)"] || 0).toFixed(
        2
      )}ms\n\n`;
  }

  if (data.metrics.vus_max) {
    output +=
      indent + `Max Concurrent Users: ${data.metrics.vus_max.values.max}\n`;
  }

  if (data.metrics.http_reqs) {
    output +=
      indent + `Total Requests: ${data.metrics.http_reqs.values.count}\n`;
    output +=
      indent +
      `Requests/sec (avg): ${data.metrics.http_reqs.values.rate.toFixed(
        2
      )}\n\n`;
  }

  if (data.metrics.errors) {
    output +=
      indent +
      `Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%\n`;
  }

  if (data.metrics.http_req_failed) {
    output +=
      indent +
      `Failed Requests: ${(
        data.metrics.http_req_failed.values.rate * 100
      ).toFixed(2)}%\n\n`;
  }

  output += indent + "\n=== Analysis ===\n";
  if (data.metrics.errors && data.metrics.errors.values.rate < 0.01) {
    output += indent + "✓ System handled stress well - error rate < 1%\n";
  } else if (data.metrics.errors && data.metrics.errors.values.rate < 0.05) {
    output += indent + "⚠ System showed some strain - error rate 1-5%\n";
  } else {
    output += indent + "✗ System reached breaking point - error rate > 5%\n";
  }

  return output;
}
