package backend.fastprint.dto;

import backend.fastprint.entity.Commande.StatutCommande;
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
public class CommandeResponse {
    private Long idCommande;
    private Long idDocument;
    private String nomFichier;
    private Integer nombrePages;
    private String typeImpression;
    private String disposition;
    private String commentaireClient;
    private BigDecimal montantCalcule;
    private StatutCommande statut;
    private String motifRefus;
    private LocalDateTime dateCreation;
    private LocalDateTime dateTraitement;
    private LocalDateTime datePret;
}