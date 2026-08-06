package backend.fastprint.controller;

import backend.fastprint.dto.ApiResponse;
import backend.fastprint.dto.NotificationResponse;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    // Toutes les notifications de l'utilisateur connecté
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMesNotifications(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(
            ApiResponse.success("Notifications récupérées",
                notificationService.getMesNotifications(utilisateur))
        );
    }

    // Notifications non lues uniquement
    @GetMapping("/non-lues")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMesNotificationsNonLues(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(
            ApiResponse.success("Notifications non lues récupérées",
                notificationService.getMesNotificationsNonLues(utilisateur))
        );
    }

    // Compteur de notifications non lues (utile pour le badge dans le frontend)
    @GetMapping("/compteur")
    public ResponseEntity<ApiResponse<Long>> getCompteurNonLues(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(
            ApiResponse.success("Compteur récupéré",
                notificationService.compterNonLues(utilisateur))
        );
    }

    // Marquer une notification comme lue
    @PutMapping("/{id}/lire")
    public ResponseEntity<ApiResponse<NotificationResponse>> marquerCommeLue(
            @PathVariable Long id,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(
            ApiResponse.success("Notification marquée comme lue",
                notificationService.marquerCommeLue(id, utilisateur))
        );
    }

    // Marquer toutes les notifications comme lues
    @PutMapping("/lire-toutes")
    public ResponseEntity<ApiResponse<Void>> marquerToutesCommeLues(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        notificationService.marquerToutesCommeLues(utilisateur);
        return ResponseEntity.ok(
            ApiResponse.success("Toutes les notifications marquées comme lues", null)
        );
    }
}