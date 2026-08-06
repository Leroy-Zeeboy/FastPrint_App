package backend.fastprint.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "utilisateur")
@ToString(exclude = {"motDePasse", "documents", "notifications"})
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilisateur")
    private Long idUtilisateur;

    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @Column(name = "prenom", nullable = false, length = 100)
    private String prenom;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "telephone", length = 30)
    private String telephone;

    @JsonIgnore
    @Column(name = "mot_de_passe", nullable = false, length = 255)
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private Statut statut;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @JsonIgnore
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private List<Document> documents;

    @JsonIgnore
    @OneToMany(mappedBy = "destinataire", fetch = FetchType.LAZY)
    private List<Notification> notifications;

    @PrePersist
    public void prePersist() {
        if (this.dateCreation == null) {
            this.dateCreation = LocalDateTime.now();
        }
        if (this.statut == null) {
            this.statut = Statut.actif;
        }
        if (this.role == null) {
            this.role = Role.client;
        }
    }

    public enum Role {
        client, gerant, administrateur
    }

    public enum Statut {
        actif, inactif
    }
}