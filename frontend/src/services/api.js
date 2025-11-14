
const API_BASE_URL = "http://localhost:8081/api";

const handleResponse = async (response) => {
  console.log(">>> Response status:", response.status);

  // In toàn bộ nội dung backend trả về
  const text = await response.text();
  console.log(">>> Raw response body:", text);

  // Nếu lỗi HTTP (ví dụ 401, 404, 500)
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = JSON.parse(text);
    } catch {
      // Không parse được JSON thì bỏ qua
    }
    throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
  }

  // Nếu không có nội dung
  if (response.status === 204) {
    return null;
  }

  // Trả về JSON parse được
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};



export const login = (username, password) => {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  }).then(handleResponse);
};

// export const register = (username, password) => {
//   return fetch(`${API_BASE_URL}/auth/register`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ username, password }),
//   }).then(handleResponse);
// };


export const getProducts = () => {
  return fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
  }).then(handleResponse);
};

// CREATE: Thêm sản phẩm mới
export const addProduct = (productData) => {
  return fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData), 
  }).then(handleResponse);
};

// UPDATE: Cập nhật sản phẩm
export const updateProduct = (id, productData) => {
  return fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  }).then(handleResponse);
};

// DELETE: Xóa sản phẩm
export const deleteProduct = (id) => {
  return fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
    },
  }).then(handleResponse);
};