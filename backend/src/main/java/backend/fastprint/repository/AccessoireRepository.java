package backend.fastprint.repository;

import backend.fastprint.entity.Accessoire;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccessoireRepository extends JpaRepository<Accessoire, Long> {
    List<Accessoire> findByActifTrue();
}