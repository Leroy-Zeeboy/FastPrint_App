package backend.fastprint.config;

import backend.fastprint.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Primary
    public UserDetailsService userDetailsService() {
        return new InMemoryUserDetailsManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Activer la configuration CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/tarifs").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/tarifs/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/forfaits").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/forfaits/**").permitAll()
    .requestMatchers("/api/tarifs/admin/**").hasRole("ADMINISTRATEUR")
    .requestMatchers("/api/forfaits/admin/**").hasRole("ADMINISTRATEUR")
    .requestMatchers("/api/admin/**").hasRole("ADMINISTRATEUR")
    .requestMatchers("/api/gerant/**").hasAnyRole("GERANT", "ADMINISTRATEUR")
    .requestMatchers(HttpMethod.GET, "/api/options-finition").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/options-finition/**").permitAll()
    .requestMatchers("/api/options-finition/admin/**").hasRole("ADMINISTRATEUR")
    .requestMatchers("/api/documents/**").authenticated()
    .requestMatchers("/api/commandes/en-attente").hasAnyRole("GERANT", "ADMINISTRATEUR")
    .requestMatchers(HttpMethod.PUT, "/api/commandes/*/traiter").hasAnyRole("GERANT", "ADMINISTRATEUR")
    .requestMatchers("/api/commandes/**").authenticated()
    .requestMatchers("/api/notifications/**").authenticated()
    .requestMatchers(HttpMethod.GET, "/api/accessoires").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/accessoires/**").permitAll()
    .requestMatchers("/api/accessoires/gerant/**").hasAnyRole("GERANT", "ADMINISTRATEUR")
    .requestMatchers("/api/panier/**").authenticated()
    .requestMatchers("/api/commandes-accessoires/**").hasAnyRole("GERANT", "ADMINISTRATEUR")
    .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
    .anyRequest().authenticated()   
            )   
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 2. Définition des règles CORS (Origines, Méthodes et Headers autorisés)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Remplacez par le port exact de votre serveur de dev React (3000, 5173, etc.)
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}