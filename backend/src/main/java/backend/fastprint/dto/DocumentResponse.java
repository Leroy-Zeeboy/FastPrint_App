package backend.fastprint.dto;

import backend.fastprint.entity.Document.StatutConservation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    private Long idDocument;
    private String nomFichier;
    private String typeFichier;
    private Integer nombrePages;
    private String typeImpression;
    private String disposition;
    private String commentaireClient;
    private BigDecimal montantCalcule;
    private LocalDateTime dateDepot;
    private LocalDateTime dateExpiration;
    private StatutConservation statutConservation;
}