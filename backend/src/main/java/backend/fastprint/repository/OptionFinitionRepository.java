package backend.fastprint.repository;

import backend.fastprint.entity.OptionFinition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OptionFinitionRepository extends JpaRepository<OptionFinition, Long> {
    List<OptionFinition> findByActifTrue();
}