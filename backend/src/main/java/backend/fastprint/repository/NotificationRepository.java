package backend.fastprint.repository;

import backend.fastprint.entity.Notification;
import backend.fastprint.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByDestinataireOrderByDateEnvoiDesc(Utilisateur destinataire);
    List<Notification> findByDestinataireAndLuFalse(Utilisateur destinataire);
}