package backend.fastprint.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class DocumentRequest {

    @NotNull(message = "Le nombre de pages est obligatoire")
    @Min(value = 1, message = "Le nombre de pages doit être supérieur à 0")
    private Integer nombrePages;

    @NotNull(message = "Le type d'impression est obligatoire")
    private String typeImpression;

    @NotNull(message = "La disposition est obligatoire")
    private String disposition;

    // Forfait choisi (optionnel)
    private Long idForfaitFinition;

    // Options à la carte (optionnel)
    private List<Long> idsOptionsFinition;

    // Commentaire libre (optionnel)
    private String commentaireClient;
}