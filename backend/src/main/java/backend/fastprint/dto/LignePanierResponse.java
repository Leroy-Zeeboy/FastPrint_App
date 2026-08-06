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
public class LignePanierResponse {
    private Long idLignePanier;
    private Long idAccessoire;
    private String nomAccessoire;
    private BigDecimal prixUnitaire;
    private Integer quantite;
    private BigDecimal sousTotal;
}