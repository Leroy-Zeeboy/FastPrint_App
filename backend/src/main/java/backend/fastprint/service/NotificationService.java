package backend.fastprint.service;

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
    public List<Notification> getMesNotifications(Utilisateur utilisateur) {
        return notificationRepository
                .findByDestinataireOrderByDateEnvoiDesc(utilisateur);
    }

    // Récupérer uniquement les notifications non lues
    public List<Notification> getMesNotificationsNonLues(Utilisateur utilisateur) {
        return notificationRepository
                .findByDestinataireAndLuFalse(utilisateur);
    }

    // Marquer une notification comme lue
    public Notification marquerCommeLue(Long id, Utilisateur utilisateur) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));

        if (!notification.getDestinataire().getIdUtilisateur()
                .equals(utilisateur.getIdUtilisateur())) {
            throw new RuntimeException("Accès non autorisé");
        }

        notification.setLu(true);
        return notificationRepository.save(notification);
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
}