    package com.flogin.security;

    import java.util.Arrays;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.http.HttpMethod;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
    import org.springframework.web.cors.CorsConfiguration;
    import org.springframework.web.cors.CorsConfigurationSource;
    import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

    // --- KẾT THÚC IMPORT CHO CORS ---

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {

        @Autowired
        private JwtAuthenticationFilter jwtAuthenticationFilter;

    // 1. Bean Băm mật khẩu (Giảm rounds cho performance testing)
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Giảm từ 10 rounds (default) xuống 4 để tăng tốc độ
        // Lưu ý: Production nên dùng 10-12 rounds
        return new BCryptPasswordEncoder(4);
    }        // 2. Bean Quản lý Xác thực (Giữ nguyên)
        @Bean
        public AuthenticationManager authenticationManager(
                AuthenticationConfiguration authenticationConfiguration) throws Exception {
            return authenticationConfiguration.getAuthenticationManager();
        }

        // 3. Cấu hình Chuỗi lọc Bảo mật (Cập nhật)
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> 
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/api/auth/**").permitAll()
                    
                    // --- THÊM DÒNG NÀY (MỞ KHÓA THƯ MỤC ẢNH) ---
                    .requestMatchers("/uploads/**").permitAll()
                    // -------------------------------------------
                    
                    .anyRequest().authenticated() 
                );
        
            http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

            return http.build();
        }

        // --- 4. BEAN MỚI: CẤU HÌNH CORS ---
        // Bean này cho phép React (localhost:3000) gọi API
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();
            
            // Cho phép React App (localhost:3000) gọi
            configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000",
                                                          "http://192.168.1.2:3000",
                                                          "http://localhost:3001")); 
            
            // Cho phép các method này
            configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); 
            
            // Cho phép tất cả các header
            configuration.setAllowedHeaders(Arrays.asList("*")); 
            
            // Cho phép gửi thông tin (credentials) như Token
            configuration.setAllowCredentials(true); 
            
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            // Áp dụng cấu hình CORS này cho tất cả API bắt đầu bằng /
            source.registerCorsConfiguration("/**", configuration); 
            return source;
        }
    }