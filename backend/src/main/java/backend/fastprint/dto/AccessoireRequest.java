package backend.fastprint.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccessoireRequest {
    private String nom;
    private String description;
    private BigDecimal prix;
    private Integer quantiteStock;
}