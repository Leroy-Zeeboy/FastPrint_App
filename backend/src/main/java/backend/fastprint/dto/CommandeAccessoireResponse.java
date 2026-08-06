package backend.fastprint.dto;

import backend.fastprint.entity.CommandeAccessoire.StatutCommande;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommandeAccessoireResponse {
    private Long idCommandeAccessoire;
    private BigDecimal montantTotal;
    private StatutCommande statut;
    private LocalDateTime dateCreation;
    private LocalDateTime datePret;
    private List<LigneCommandeAccessoireResponse> lignes;

    // Infos client (utile côté gérant)
    private String clientNom;
    private String clientPrenom;
    private String clientTelephone;
}