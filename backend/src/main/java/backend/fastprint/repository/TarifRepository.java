package backend.fastprint.repository;

import backend.fastprint.entity.Tarif;
import backend.fastprint.entity.Tarif.TypeImpression;
import backend.fastprint.entity.Tarif.Disposition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TarifRepository extends JpaRepository<Tarif, Long> {
    Optional<Tarif> findByTypeImpressionAndDisposition(
        TypeImpression typeImpression,
        Disposition disposition
    );
}