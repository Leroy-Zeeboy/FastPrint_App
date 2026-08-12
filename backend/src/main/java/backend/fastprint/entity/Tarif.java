package backend.fastprint.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tarif")
@ToString(exclude = "documents")
public class Tarif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarif")
    private Long idTarif;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_impression", nullable = false)
    private TypeImpression typeImpression;

    @Enumerated(EnumType.STRING)
    @Column(name = "disposition", nullable = false)
    private Disposition disposition;

    @Column(name = "prix_unitaire", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    @Column(name = "date_maj")
    private LocalDateTime dateMaj;

    @JsonIgnore
    @OneToMany(mappedBy = "tarif", fetch = FetchType.LAZY)
    private List<Document> documents;

    @PrePersist
    @PreUpdate
    public void preModification() {
        this.dateMaj = LocalDateTime.now();
    }

    public enum TypeImpression {
        noir_et_blanc, couleur
    }

    public enum Disposition {
        recto_simple, recto_verso
    }
}