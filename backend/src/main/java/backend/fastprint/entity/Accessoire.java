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
@Table(name = "accessoire")
public class Accessoire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_accessoire")
    private Long idAccessoire;

    @Column(name = "nom", nullable = false, length = 150)
    private String nom;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "prix", nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;

    @Column(name = "quantite_stock", nullable = false)
    private Integer quantiteStock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_publie_par", nullable = false)
    private Utilisateur publiePar;

    @Column(name = "date_publication", nullable = false, updatable = false)
    private LocalDateTime datePublication;

    @Column(name = "actif", nullable = false)
    private Boolean actif;

    @PrePersist
    public void prePersist() {
        if (this.datePublication == null) {
            this.datePublication = LocalDateTime.now();
        }
        if (this.actif == null) {
            this.actif = true;
        }
    }
}