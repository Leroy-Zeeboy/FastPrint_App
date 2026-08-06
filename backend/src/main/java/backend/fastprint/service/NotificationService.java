package backend.fastprint.service;

import backend.fastprint.dto.NotificationResponse;
import backend.fastprint.entity.Notification;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Récupérer toutes les notifications de l'utilisateur connecté
    public List<NotificationResponse> getMesNotifications(Utilisateur utilisateur) {
        return notificationRepository
                .findByDestinataireOrderByDateEnvoiDesc(utilisateur)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Récupérer uniquement les notifications non lues
    public List<NotificationResponse> getMesNotificationsNonLues(Utilisateur utilisateur) {
        return notificationRepository
                .findByDestinataireAndLuFalse(utilisateur)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Marquer une notification comme lue
    public NotificationResponse marquerCommeLue(Long id, Utilisateur utilisateur) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));

        if (!notification.getDestinataire().getIdUtilisateur()
                .equals(utilisateur.getIdUtilisateur())) {
            throw new RuntimeException("Accès non autorisé");
        }

        notification.setLu(true);
        notification = notificationRepository.save(notification);
        return toResponse(notification);
    }

    // Marquer toutes les notifications comme lues
    public void marquerToutesCommeLues(Utilisateur utilisateur) {
        List<Notification> nonLues = notificationRepository
                .findByDestinataireAndLuFalse(utilisateur);
        nonLues.forEach(n -> n.setLu(true));
        notificationRepository.saveAll(nonLues);
    }

    // Compter les notifications non lues
    public long compterNonLues(Utilisateur utilisateur) {
        return notificationRepository
                .findByDestinataireAndLuFalse(utilisateur).size();
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .idNotification(notification.getIdNotification())
                .type(notification.getType())
                .message(notification.getMessage())
                .lu(notification.getLu())
                .dateEnvoi(notification.getDateEnvoi())
                .build();
    }
}