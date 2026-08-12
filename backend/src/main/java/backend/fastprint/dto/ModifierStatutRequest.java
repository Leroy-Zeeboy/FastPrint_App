package backend.fastprint.dto;

import lombok.Data;

@Data
public class ModifierStatutRequest {
    private String statut; // "actif" ou "inactif"
}