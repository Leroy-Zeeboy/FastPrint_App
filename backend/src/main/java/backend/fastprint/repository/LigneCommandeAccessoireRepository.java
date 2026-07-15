package backend.fastprint.repository;

import backend.fastprint.entity.LigneCommandeAccessoire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LigneCommandeAccessoireRepository
        extends JpaRepository<LigneCommandeAccessoire, Long> {
}