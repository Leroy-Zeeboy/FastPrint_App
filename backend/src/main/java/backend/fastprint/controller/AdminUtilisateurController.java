package backend.fastprint.controller;

import backend.fastprint.dto.ApiResponse;
import backend.fastprint.dto.ModifierRoleRequest;
import backend.fastprint.dto.ModifierStatutRequest;
import backend.fastprint.dto.UtilisateurResponse;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.service.AdminUtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/utilisateurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminUtilisateurController {

    private final AdminUtilisateurService adminUtilisateurService;

    // Liste de tous les utilisateurs
    @GetMapping
    public ResponseEntity<ApiResponse<List<UtilisateurResponse>>> getTousLesUtilisateurs() {
        return ResponseEntity.ok(
            ApiResponse.success("Utilisateurs récupérés",
                adminUtilisateurService.getTousLesUtilisateurs())
        );
    }

    // Modifier le rôle d'un utilisateur
    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse<UtilisateurResponse>> modifierRole(
            @PathVariable Long id,
            @RequestBody ModifierRoleRequest request,
            @AuthenticationPrincipal Utilisateur admin) {
        return ResponseEntity.ok(
            ApiResponse.success("Rôle modifié",
                adminUtilisateurService.modifierRole(id, request, admin))
        );
    }

    // Activer / désactiver un utilisateur
    @PutMapping("/{id}/statut")
    public ResponseEntity<ApiResponse<UtilisateurResponse>> modifierStatut(
            @PathVariable Long id,
            @RequestBody ModifierStatutRequest request,
            @AuthenticationPrincipal Utilisateur admin) {
        return ResponseEntity.ok(
            ApiResponse.success("Statut modifié",
                adminUtilisateurService.modifierStatut(id, request, admin))
        );
    }
}