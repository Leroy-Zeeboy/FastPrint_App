package backend.fastprint.repository;

import backend.fastprint.entity.CommandeAccessoire;
import backend.fastprint.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommandeAccessoireRepository extends JpaRepository<CommandeAccessoire, Long> {
    List<CommandeAccessoire> findByClient(Utilisateur client);
}