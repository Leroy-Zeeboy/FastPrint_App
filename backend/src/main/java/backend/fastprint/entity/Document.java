package backend.fastprint.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "document")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_document")
    private Long idDocument;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client", nullable = false)
    private Utilisateur client;

    @Column(name = "nom_fichier", nullable = false, length = 255)
    private String nomFichier;

    @Column(name = "type_fichier", nullable = false, length = 20)
    private String typeFichier;

    @Column(name = "chemin_fichier", length = 500)
    private String cheminFichier;

    @Column(name = "nombre_pages", nullable = false)
    private Integer nombrePages;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tarif", nullable = false)
    private Tarif tarif;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_forfait_finition")
    private ForfaitFinition forfaitFinition;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "document_option_finition",
        joinColumns = @JoinColumn(name = "id_document"),
        inverseJoinColumns = @JoinColumn(name = "id_option")
    )
    private List<OptionFinition> optionsFinition;

    @Column(name = "commentaire_client", columnDefinition = "TEXT")
    private String commentaireClient;

    @Column(name = "date_depot", nullable = false, updatable = false)
    private LocalDateTime dateDepot;

    @Column(name = "date_expiration", nullable = false)
    private LocalDateTime dateExpiration;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_conservation", nullable = false)
    private StatutConservation statutConservation;

    @Column(name = "date_archivage")
    private LocalDateTime dateArchivage;

    // --- Relation inverse ---
    @OneToOne(mappedBy = "document", fetch = FetchType.LAZY)
    private Commande commande;

    @PrePersist
    public void prePersist() {
        if (this.dateDepot == null) {
            this.dateDepot = LocalDateTime.now();
        }
        if (this.statutConservation == null) {
            this.statutConservation = StatutConservation.actif;
        }
    }

    public enum StatutConservation {
        actif, archive, supprime
    }
}