package backend.fastprint.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AjouterAuPanierRequest {

    @NotNull(message = "L'identifiant de l'accessoire est obligatoire")
    private Long idAccessoire;

    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 1, message = "La quantité doit être supérieure à 0")
    private Integer quantite;
}