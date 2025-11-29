import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 1,
  iterations: 50, // Tạo 50 users
};

const BASE_URL = "http://localhost:8080";

export default function () {
  const userId = __ITER + 1; // __ITER bắt đầu từ 0

  const payload = JSON.stringify({
    username: `testuser${userId}`,
    email: `testuser${userId}@test.com`,
    password: "password123",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = http.post(`${BASE_URL}/api/auth/register`, payload, params);

  console.log(`[${userId}] Created user testuser${userId}: ${response.status}`);

  sleep(0.1); // Delay nhỏ để tránh overwhelm server
}
