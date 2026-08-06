package backend.fastprint.service;

import backend.fastprint.dto.CommandeAccessoireResponse;
import backend.fastprint.dto.LigneCommandeAccessoireResponse;
import backend.fastprint.dto.TraiterCommandeAccessoireRequest;
import backend.fastprint.entity.CommandeAccessoire;
import backend.fastprint.entity.CommandeAccessoire.StatutCommande;
import backend.fastprint.entity.LigneCommandeAccessoire;
import backend.fastprint.entity.Notification;
import backend.fastprint.repository.CommandeAccessoireRepository;
import backend.fastprint.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommandeAccessoireService {

    private final CommandeAccessoireRepository commandeAccessoireRepository;
    private final NotificationRepository notificationRepository;

    // Gérant : toutes les commandes d'accessoires, les plus récentes en premier
    public List<CommandeAccessoireResponse> getToutesLesCommandes() {
        return commandeAccessoireRepository.findAll().stream()
                .sorted(Comparator.comparing(CommandeAccessoire::getDateCreation).reversed())
                .map(this::toResponse)
                .toList();
    }

    // Gérant : commandes en attente uniquement
    public List<CommandeAccessoireResponse> getCommandesEnAttente() {
        return commandeAccessoireRepository.findAll().stream()
                .filter(c -> c.getStatut() == StatutCommande.en_attente)
                .sorted(Comparator.comparing(CommandeAccessoire::getDateCreation).reversed())
                .map(this::toResponse)
                .toList();
    }

    // Gérant : marquer une commande comme prête ou récupérée
    public CommandeAccessoireResponse traiterCommande(
            Long id, TraiterCommandeAccessoireRequest request) {

        CommandeAccessoire commande = commandeAccessoireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        StatutCommande nouveauStatut = StatutCommande.valueOf(request.getStatut());
        commande.setStatut(nouveauStatut);

        if (nouveauStatut == StatutCommande.prete) {
            commande.setDatePret(LocalDateTime.now());

            Notification notification = Notification.builder()
                    .destinataire(commande.getClient())
                    .type("COMMANDE_ACCESSOIRE_PRETE")
                    .message("Votre commande de fournitures (montant : "
                        + commande.getMontantTotal()
                        + " FCFA) est prête. Vous pouvez venir la récupérer.")
                    .lu(false)
                    .build();
            notificationRepository.save(notification);
        }

        commande = commandeAccessoireRepository.save(commande);
        return toResponse(commande);
    }

    private CommandeAccessoireResponse toResponse(CommandeAccessoire commande) {
        List<LigneCommandeAccessoireResponse> lignes = commande.getLignes() == null
                ? List.of()
                : commande.getLignes().stream()
                    .map(this::toLigneResponse)
                    .toList();

        return CommandeAccessoireResponse.builder()
                .idCommandeAccessoire(commande.getIdCommandeAccessoire())
                .montantTotal(commande.getMontantTotal())
                .statut(commande.getStatut())
                .dateCreation(commande.getDateCreation())
                .datePret(commande.getDatePret())
                .lignes(lignes)
                .clientNom(commande.getClient().getNom())
                .clientPrenom(commande.getClient().getPrenom())
                .clientTelephone(commande.getClient().getTelephone())
                .build();
    }

    private LigneCommandeAccessoireResponse toLigneResponse(LigneCommandeAccessoire ligne) {
        BigDecimal sousTotal = ligne.getPrixUnitaireAuMoment()
                .multiply(BigDecimal.valueOf(ligne.getQuantite()));

        return LigneCommandeAccessoireResponse.builder()
                .idLigneCommande(ligne.getIdLigneCommande())
                .idAccessoire(ligne.getAccessoire().getIdAccessoire())
                .nomAccessoire(ligne.getAccessoire().getNom())
                .quantite(ligne.getQuantite())
                .prixUnitaireAuMoment(ligne.getPrixUnitaireAuMoment())
                .sousTotal(sousTotal)
                .build();
    }
}