package backend.fastprint.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "commande")
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_commande")
    private Long idCommande;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_document", nullable = false, unique = true)
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_traite_par")
    private Utilisateur traitePar;

    @Column(name = "montant_calcule", nullable = false, precision = 10, scale = 2)
    private BigDecimal montantCalcule;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private StatutCommande statut;

    @Column(name = "motif_refus", length = 255)
    private String motifRefus;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_traitement")
    private LocalDateTime dateTraitement;

    @Column(name = "date_pret")
    private LocalDateTime datePret;

    @PrePersist
    public void prePersist() {
        if (this.dateCreation == null) {
            this.dateCreation = LocalDateTime.now();
        }
        if (this.statut == null) {
            this.statut = StatutCommande.en_attente;
        }
    }

    public enum StatutCommande {
        en_attente, refusee, en_cours, prete
    }
}