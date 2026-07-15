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
import org.springframework.http.HttpMethod;

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
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
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
    .requestMatchers("/api/accessoires/gerant/**")
    .hasAnyRole("GERANT", "ADMINISTRATEUR")
    .anyRequest().authenticated()
)
            // Ajouter notre filtre JWT avant le filtre d'authentification standard
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}