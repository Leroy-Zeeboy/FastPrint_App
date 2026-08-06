package backend.fastprint.dto;

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
public class PanierResponse {
    private Long idPanier;
    private LocalDateTime dateCreation;
    private List<LignePanierResponse> lignes;
    private BigDecimal montantTotal;
}