package backend.fastprint.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "option_finition")
@ToString(exclude = "documents")
public class OptionFinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_option")
    private Long idOption;

    @Enumerated(EnumType.STRING)
    @Column(name = "categorie", nullable = false)
    private Categorie categorie;

    @Column(name = "libelle", nullable = false, length = 100)
    private String libelle;

    @Column(name = "sur_cout", nullable = false, precision = 10, scale = 2)
    private BigDecimal surCout;

    @Column(name = "actif", nullable = false)
    private Boolean actif;

    // --- Relations ---
    @JsonIgnore
    @ManyToMany(mappedBy = "optionsFinition", fetch = FetchType.LAZY)
    private List<Document> documents;

    public enum Categorie {
        premiere_page, couverture, reliure
    }
}