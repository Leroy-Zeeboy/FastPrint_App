package backend.fastprint.repository;

import backend.fastprint.entity.ForfaitFinition;
import backend.fastprint.entity.ForfaitFinition.TypeForfait;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForfaitFinitionRepository extends JpaRepository<ForfaitFinition, Long> {
    List<ForfaitFinition> findByType(TypeForfait type);
}