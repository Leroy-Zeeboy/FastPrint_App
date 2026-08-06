package backend.fastprint.dto;

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
public class AccessoireResponse {
    private Long idAccessoire;
    private String nom;
    private String description;
    private BigDecimal prix;
    private Integer quantiteStock;
    private String imageUrl;
    private LocalDateTime datePublication;
    private Boolean actif;
}