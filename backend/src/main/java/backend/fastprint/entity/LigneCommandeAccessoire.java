package backend.fastprint.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ligne_commande_accessoire")
public class LigneCommandeAccessoire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ligne_commande")
    private Long idLigneCommande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_commande_accessoire", nullable = false)
    private CommandeAccessoire commandeAccessoire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_accessoire", nullable = false)
    private Accessoire accessoire;

    @Column(name = "quantite", nullable = false)
    private Integer quantite;

    @Column(name = "prix_unitaire_au_moment", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaireAuMoment;
}