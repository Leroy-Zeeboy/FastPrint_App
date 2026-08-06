package backend.fastprint.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class TarifResponse {
    private Long idTarif;
    private String typeImpression;
    private String disposition;
    private BigDecimal prixUnitaire;
}