package backend.fastprint.service;

import backend.fastprint.dto.ModifierRoleRequest;
import backend.fastprint.dto.ModifierStatutRequest;
import backend.fastprint.dto.UtilisateurResponse;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.entity.Utilisateur.Role;
import backend.fastprint.entity.Utilisateur.Statut;
import backend.fastprint.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    // Liste de tous les utilisateurs, les plus récents en premier
    public List<UtilisateurResponse> getTousLesUtilisateurs() {
        return utilisateurRepository.findAll().stream()
                .sorted(Comparator.comparing(Utilisateur::getDateCreation).reversed())
                .map(this::toResponse)
                .toList();
    }

    // Modifier le rôle d'un utilisateur
    public UtilisateurResponse modifierRole(
            Long id, ModifierRoleRequest request, Utilisateur admin) {

        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (utilisateur.getIdUtilisateur().equals(admin.getIdUtilisateur())) {
            throw new RuntimeException("Vous ne pouvez pas modifier votre propre rôle");
        }

        Role nouveauRole = Role.valueOf(request.getRole());
        utilisateur.setRole(nouveauRole);
        utilisateur = utilisateurRepository.save(utilisateur);
        return toResponse(utilisateur);
    }

    // Activer / désactiver un utilisateur
    public UtilisateurResponse modifierStatut(
            Long id, ModifierStatutRequest request, Utilisateur admin) {

        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (utilisateur.getIdUtilisateur().equals(admin.getIdUtilisateur())) {
            throw new RuntimeException("Vous ne pouvez pas désactiver votre propre compte");
        }

        Statut nouveauStatut = Statut.valueOf(request.getStatut());
        utilisateur.setStatut(nouveauStatut);
        utilisateur = utilisateurRepository.save(utilisateur);
        return toResponse(utilisateur);
    }

    private UtilisateurResponse toResponse(Utilisateur utilisateur) {
        return UtilisateurResponse.builder()
                .idUtilisateur(utilisateur.getIdUtilisateur())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .email(utilisateur.getEmail())
                .telephone(utilisateur.getTelephone())
                .role(utilisateur.getRole())
                .statut(utilisateur.getStatut())
                .dateCreation(utilisateur.getDateCreation())
                .build();
    }
}