package backend.fastprint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommandeAccessoireResponse {
    private Long idLigneCommande;
    private Long idAccessoire;
    private String nomAccessoire;
    private Integer quantite;
    private BigDecimal prixUnitaireAuMoment;
    private BigDecimal sousTotal;
}