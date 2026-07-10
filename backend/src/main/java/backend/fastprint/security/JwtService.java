package backend.fastprint.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // Génère un token JWT pour un utilisateur
    public String genererToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extrait l'email depuis le token
    public String extraireEmail(String token) {
        return extraireClaim(token, Claims::getSubject);
    }

    // Extrait le rôle depuis le token
    public String extraireRole(String token) {
        return extraireClaim(token, claims -> claims.get("role", String.class));
    }

    // Vérifie si le token est valide
    public boolean estValide(String token, String email) {
        final String emailExtrait = extraireEmail(token);
        return emailExtrait.equals(email) && !estExpire(token);
    }

    // Vérifie si le token est expiré
    private boolean estExpire(String token) {
        return extraireClaim(token, Claims::getExpiration).before(new Date());
    }

    // Méthode générique pour extraire n'importe quelle information du token
    private <T> T extraireClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extraireTousClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extraireTousClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}