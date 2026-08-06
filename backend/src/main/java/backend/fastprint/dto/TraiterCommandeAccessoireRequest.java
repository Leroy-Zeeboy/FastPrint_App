package backend.fastprint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TraiterCommandeAccessoireRequest {
    private String statut; // "prete" ou "recuperee"
}