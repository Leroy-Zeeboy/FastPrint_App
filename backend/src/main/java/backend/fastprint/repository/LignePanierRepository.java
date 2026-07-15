package backend.fastprint.repository;

import backend.fastprint.entity.LignePanier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LignePanierRepository extends JpaRepository<LignePanier, Long> {
}