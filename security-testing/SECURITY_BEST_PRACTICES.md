# Thực Hành Bảo Mật Tốt Nhất - Đã Triển Khai

## 1. Mã Hóa Mật Khẩu (BCrypt) ✓ ĐÃ TRIỂN KHAI

### Triển Khai Hiện Tại

- ✅ Sử dụng BCrypt password encoder
- ✅ Mật khẩu KHÔNG được lưu dưới dạng plaintext (văn bản thuần)
- ✅ Salt được tự động tạo ra bởi BCrypt

### Kiểm Tra

```java
// Trong SecurityConfig.java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

### Các Tiêu Chuẩn Đã Áp Dụng:

- Độ mạnh BCrypt: Mặc định 10 vòng lặp
- Tự động tạo salt ngẫu nhiên
- Kháng được tấn công Rainbow table

---

## 2. Bắt Buộc HTTPS

### Cho Triển Khai Production

Thêm vào file `application.yml`:

```yaml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: your-password
    key-store-type: PKCS12
    key-alias: tomcat
```

### Chuyển Hướng Bắt Buộc HTTPS

Thêm vào `SecurityConfig.java`:

```java
http.requiresChannel(channel ->
    channel.anyRequest().requiresSecure()
);
```

### Trạng Thái Hiện Tại

- ⚠️ Development: Dùng HTTP (localhost:8080)
- 🔒 Production: Cần bật HTTPS

---

## 3. Cấu Hình CORS ✓ ĐÃ TRIỂN KHAI

### Triển Khai Hiện Tại

```java
// SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:3000",
        "http://192.168.1.2:3000"
    ));
    configuration.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "OPTIONS"
    ));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    return source;
}
```

### Các Tiêu Chuẩn Đã Áp Dụng:

- ✅ Chỉ định cụ thể origins (không dùng "\*")
- ✅ Giới hạn các phương thức HTTP
- ✅ Hỗ trợ credentials cho JWT

### Khuyến Nghị:

- 🎯 Thêm CORS origins theo môi trường
- 🎯 Production: Chỉ cho phép domain cụ thể

---

## 4. Security Headers (Các Header Bảo Mật)

### Cần Triển Khai

Thêm vào `SecurityConfig.java`:

```java
http.headers(headers -> headers
    .contentTypeOptions(contentType -> contentType.disable())
    .xssProtection(xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
    .frameOptions(frame -> frame.deny())
    .httpStrictTransportSecurity(hsts -> hsts
        .includeSubDomains(true)
        .maxAgeInSeconds(31536000)
    )
);
```

### Danh Sách Security Headers:

- [ ] X-Content-Type-Options: nosniff (Chặn MIME-sniffing)
- [ ] X-Frame-Options: DENY (Chống clickjacking)
- [ ] X-XSS-Protection: 1; mode=block (Bảo vệ XSS)
- [ ] Strict-Transport-Security (HSTS - Bắt buộc HTTPS)
- [ ] Content-Security-Policy (CSP - Chính sách nội dung)

---

## 5. Bảo Mật JWT ✓ ĐÃ TRIỂN KHAI

### Triển Khai Hiện Tại

- ✅ Xác thực dựa trên JWT token
- ✅ Phiên làm việc không trạng thái (Stateless)
- ✅ Kiểm tra token mỗi request

### Khuyến Nghị:

1. **Hết Hạn Token**: Đặt thời gian hợp lý (1-24 giờ)
2. **Refresh Token**: Triển khai cơ chế làm mới token
3. **Token Blacklist**: Thêm logout với vô hiệu hóa token
4. **Secret Key**: Dùng khóa mạnh, dựa trên môi trường

```yaml
# application.yml
jwt:
  secret: ${JWT_SECRET:your-very-long-secret-key-min-256-bits}
  expiration: 86400000 # 24 giờ tính bằng milliseconds
```

---

## 6. Validation và Sanitization Đầu Vào ✓ MỘT PHẦN

### Triển Khai Hiện Tại

- ✅ Jakarta Validation annotations (@Valid)
- ✅ Bean Validation

### Khuyến Nghị:

Thêm vào các DTO:

```java
public class ProductDto {
    @NotBlank(message = "Tên sản phẩm là bắt buộc")
    @Size(min = 3, max = 100)
    @Pattern(regexp = "^[a-zA-Z0-9\\s-]+$", message = "Ký tự không hợp lệ")
    private String name;

    @NotNull
    @Positive
    @Max(1000000)
    private Double price;
}

public class RegisterRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$")
    private String username;

    @NotBlank
    @Size(min = 8, max = 50)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
             message = "Mật khẩu phải có chữ hoa, chữ thường và số")
    private String password;

    @NotBlank
    @Email
    private String email;
}
```

### Ngăn Chặn XSS:

```java
// Thêm dependency
<dependency>
    <groupId>org.owasp.encoder</groupId>
    <artifactId>encoder</artifactId>
    <version>1.2.3</version>
</dependency>

// Làm sạch input
import org.owasp.encoder.Encode;

String sanitized = Encode.forHtml(userInput);
```

---

## 7. Phòng Chống SQL Injection ✓ ĐÃ TRIỂN KHAI

### Triển Khai Hiện Tại

- ✅ JPA/Hibernate với parameterized queries (truy vấn tham số hóa)
- ✅ Spring Data repositories (tự động bảo vệ)

### Thực Hành Tốt:

```java
// ✅ TỐT - Dùng tham số
@Query("SELECT u FROM User u WHERE u.username = :username")
User findByUsername(@Param("username") String username);

// ❌ TỒI - Nối chuỗi trực tiếp
@Query("SELECT u FROM User u WHERE u.username = '" + username + "'")
```

---

## 8. Giới Hạn Tốc Độ (Rate Limiting)

### Khuyến Nghị: Thêm Bucket4j

```xml
<dependency>
    <groupId>com.github.vladimir-bukhtoyarov</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>8.0.1</version>
</dependency>
```

```java
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    private Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k -> {
            // Giới hạn 20 requests mỗi phút
            Bandwidth limit = Bandwidth.classic(20, Refill.intervally(20, Duration.ofMinutes(1)));
            return Bucket.builder()
                .addLimit(limit)
                .build();
        });
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String key = request.getRemoteAddr();
        Bucket bucket = resolveBucket(key);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429); // Quá nhiều requests
            response.getWriter().write("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
        }
    }
}
```

---

## 9. Xử Lý Lỗi - Không Để Lộ Thông Tin

### Global Exception Handler (Xử lý lỗi toàn cục)

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        // KHÔNG để lộ stack trace ra môi trường production
        ErrorResponse error = new ErrorResponse(
            "Đã xảy ra lỗi",
            HttpStatus.INTERNAL_SERVER_ERROR.value()
        );

        // Chỉ log chi tiết lỗi ở phía server
        log.error("Error occurred", ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(AuthenticationException ex) {
        // Thông báo chung - không tiết lộ user có tồn tại hay không
        ErrorResponse error = new ErrorResponse(
            "Thông tin đăng nhập không hợp lệ",
            HttpStatus.UNAUTHORIZED.value()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
}
```

---

## 10. Danh Sách Kiểm Tra Bảo Mật

### ✅ Đã Triển Khai

- [x] Mã hóa mật khẩu (BCrypt)
- [x] Xác thực JWT
- [x] Cấu hình CORS
- [x] Phòng chống SQL Injection (JPA)
- [x] Validation đầu vào (@Valid)
- [x] Phiên không trạng thái (Stateless sessions)

### ⚠️ Một Phần / Cần Cải Thiện

- [ ] Bắt buộc HTTPS (cho production)
- [ ] Security headers (cần thêm)
- [ ] Làm sạch XSS (thêm OWASP encoder)
- [ ] Chính sách mật khẩu mạnh (thêm validation)
- [ ] Giới hạn tốc độ (chưa triển khai)
- [ ] Cơ chế làm mới token
- [ ] Khóa tài khoản sau nhiều lần đăng nhập sai

### 🎯 Khuyến Nghị

1. **Ưu tiên cao**:

   - Thêm security headers
   - Triển khai validation mật khẩu mạnh
   - Thêm rate limiting cho endpoint đăng nhập

2. **Ưu tiên trung bình**:

   - Cơ chế làm mới token
   - Thư viện làm sạch XSS
   - JWT secrets dựa trên môi trường

3. **Yêu cầu Production**:
   - Bật HTTPS
   - Xóa CORS origins của môi trường development
   - Triển khai logging toàn diện
   - Thêm giám sát/cảnh báo cho sự kiện bảo mật

---

## Kiểm Thử Bảo Mật

### Chạy Security Tests

```bash
cd backend
mvn test -Dtest=SecurityTest
```

### Kiểm Thử Thủ Công

Sử dụng các file `.http` trong `security-testing/vulnerability-tests/`:

- sql-injection-tests.http
- xss-tests.http
- csrf-tests.http
- auth-bypass-tests.http

---

## Tài Liệu Tham Khảo

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Spring Security Docs: https://spring.io/projects/spring-security
- JWT Best Practices: https://tools.ietf.org/html/rfc8725
