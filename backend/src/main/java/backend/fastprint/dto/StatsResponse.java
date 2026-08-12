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
public class StatsResponse {
    // Utilisateurs
    private long totalUtilisateurs;
    private long totalClients;
    private long totalGerants;
    private long totalAdministrateurs;

    // Commandes de documents
    private long totalCommandesDocuments;
    private long commandesDocumentsEnAttente;
    private long commandesDocumentsPretes;
    private long commandesDocumentsRefusees;
    private BigDecimal chiffreAffairesDocuments;

    // Commandes d'accessoires
    private long totalCommandesAccessoires;
    private long commandesAccessoiresEnAttente;
    private BigDecimal chiffreAffairesAccessoires;

    // Catalogue
    private long totalAccessoiresActifs;
}