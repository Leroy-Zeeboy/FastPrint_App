package backend.fastprint.repository;

import backend.fastprint.entity.Document;
import backend.fastprint.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByClient(Utilisateur client);
}