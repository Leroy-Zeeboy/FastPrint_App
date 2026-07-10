package backend.fastprint.service;

import backend.fastprint.dto.AuthResponse;
import backend.fastprint.dto.LoginRequest;
import backend.fastprint.dto.RegisterRequest;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.entity.Utilisateur.Role;
import backend.fastprint.entity.Utilisateur.Statut;
import backend.fastprint.repository.UtilisateurRepository;
import backend.fastprint.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse inscrire(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Un compte existe déjà avec cet email");
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .telephone(request.getTelephone())
                .role(Role.client)
                .statut(Statut.actif)
                .build();

        utilisateurRepository.save(utilisateur);

        String token = jwtService.genererToken(
            utilisateur.getEmail(),
            utilisateur.getRole().name()
        );

        return AuthResponse.builder()
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().name())
                .token(token)
                .build();
    }

    public AuthResponse connecter(LoginRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        if (utilisateur.getStatut() != Statut.actif) {
            throw new RuntimeException("Votre compte est suspendu ou inactif");
        }

        String token = jwtService.genererToken(
            utilisateur.getEmail(),
            utilisateur.getRole().name()
        );

        return AuthResponse.builder()
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().name())
                .token(token)
                .build();
    }
}