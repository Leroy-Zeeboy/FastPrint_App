package backend.fastprint.repository;

import backend.fastprint.entity.Commande;
import backend.fastprint.entity.Commande.StatutCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findByStatut(StatutCommande statut);
}