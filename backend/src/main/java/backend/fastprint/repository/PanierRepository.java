package backend.fastprint.repository;

import backend.fastprint.entity.Panier;
import backend.fastprint.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PanierRepository extends JpaRepository<Panier, Long> {
    Optional<Panier> findByClient(Utilisateur client);
}