package backend.fastprint.security;

import backend.fastprint.entity.Utilisateur;
import backend.fastprint.repository.UtilisateurRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UtilisateurRepository utilisateurRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Ne pas appliquer le filtre JWT sur les requêtes PREFLIGHT (OPTIONS)
        return "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        System.out.println(">>> [JwtAuthFilter] " + request.getMethod() + " " + request.getRequestURI());
        System.out.println(">>> Header Authorization present: " + (authHeader != null));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println(">>> Pas de token Bearer, requête traitée en anonyme.");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String token = authHeader.substring(7);
            final String email = jwtService.extraireEmail(token);
            System.out.println(">>> Email extrait du token: " + email);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                        .orElse(null);
                System.out.println(">>> Utilisateur trouvé en base: " + (utilisateur != null));

                if (utilisateur != null) {
                    boolean valide = jwtService.estValide(token, email);
                    System.out.println(">>> Token valide: " + valide);

                    if (valide) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        utilisateur,
                                        null,
                                        List.of(new SimpleGrantedAuthority(
                                            "ROLE_" + utilisateur.getRole().name().toUpperCase()
                                        ))
                                );
                        authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                        );
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        System.out.println(">>> Authentification posée avec succès pour " + email);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println(">>> Erreur JWT: " + e.getMessage());
            e.printStackTrace();
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}