package backend.fastprint.dto;

import backend.fastprint.entity.Utilisateur.Role;
import backend.fastprint.entity.Utilisateur.Statut;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurResponse {
    private Long idUtilisateur;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private Role role;
    private Statut statut;
    private LocalDateTime dateCreation;
}