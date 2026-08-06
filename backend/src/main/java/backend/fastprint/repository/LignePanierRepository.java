package backend.fastprint.repository;

import backend.fastprint.entity.LignePanier;
import backend.fastprint.entity.Panier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface LignePanierRepository extends JpaRepository<LignePanier, Long> {

    List<LignePanier> findByPanier(Panier panier);

    @Modifying
    @Transactional
    void deleteByPanier(Panier panier);
}