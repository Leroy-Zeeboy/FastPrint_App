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
@Table(name = "forfait_finition")
@ToString(exclude = "documents")
public class ForfaitFinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_forfait")
    private Long idForfait;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TypeForfait type;

    @Column(name = "palier_min", nullable = false)
    private Integer palierMin;

    @Column(name = "palier_max", nullable = false)
    private Integer palierMax;

    @Column(name = "prix", nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;

    @Column(name = "date_maj")
    private LocalDateTime dateMaj;

    @JsonIgnore
    @OneToMany(mappedBy = "forfaitFinition", fetch = FetchType.LAZY)
    private List<Document> documents;

    @PrePersist
    @PreUpdate
    public void preModification() {
        this.dateMaj = LocalDateTime.now();
    }

    public enum TypeForfait {
        standard, premium
    }
}