package backend.fastprint.dto;

import lombok.Data;

@Data
public class TraiterCommandeRequest {
    private String statut; // "prete" ou "refusee"
    private String motifRefus; // optionnel, si refusée
}