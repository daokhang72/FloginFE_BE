import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("errors");

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 100 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
    errors: ["rate<0.05"], // Cho phép 5% lỗi để test nhanh
  },
};

const BASE_URL = "http://localhost:8080";

// Tạo array 50 users
const testUsers = [];
for (let i = 1; i <= 50; i++) {
  testUsers.push({
    username: `testuser${i}`,
    password: "password123",
  });
}

export default function () {
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];

  const payload = JSON.stringify({
    username: user.username,
    password: user.password,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = http.post(`${BASE_URL}/api/auth/login`, payload, params);

  const checkResult = check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });

  errorRate.add(!checkResult);

  sleep(1);
}
