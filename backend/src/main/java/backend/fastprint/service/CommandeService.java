package backend.fastprint.service;

import backend.fastprint.dto.CommandeResponse;
import backend.fastprint.dto.TraiterCommandeRequest;
import backend.fastprint.entity.Commande;
import backend.fastprint.entity.Commande.StatutCommande;
import backend.fastprint.entity.Notification;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.repository.CommandeRepository;
import backend.fastprint.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommandeService {

    private final CommandeRepository commandeRepository;
    private final NotificationRepository notificationRepository;

    // Client : historique de ses commandes
    public List<CommandeResponse> getMesCommandes(Utilisateur client) {
        return commandeRepository.findAll().stream()
                .filter(c -> c.getDocument().getClient()
                    .getIdUtilisateur().equals(client.getIdUtilisateur()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Gérant : toutes les commandes en attente
    public List<CommandeResponse> getCommandesEnAttente() {
        return commandeRepository.findByStatut(StatutCommande.en_attente)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Gérant : historique des commandes déjà traitées (prêtes ou refusées)
    public List<CommandeResponse> getCommandesTraitees() {
        return commandeRepository.findAll().stream()
                .filter(c -> c.getStatut() == StatutCommande.prete
                    || c.getStatut() == StatutCommande.refusee)
                .sorted(Comparator.comparing(
                    Commande::getDateTraitement,
                    Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Gérant : détail d'une commande
    public CommandeResponse getCommandeParId(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));
        return toResponse(commande);
    }

    // Gérant : traiter une commande (marquer prête ou refuser)
    public CommandeResponse traiterCommande(
            Long id,
            TraiterCommandeRequest request,
            Utilisateur gerant) {

        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (commande.getStatut() != StatutCommande.en_attente) {
            throw new RuntimeException("Cette commande a déjà été traitée");
        }

        StatutCommande nouveauStatut = StatutCommande.valueOf(request.getStatut());
        commande.setStatut(nouveauStatut);
        commande.setTraitePar(gerant);
        commande.setDateTraitement(LocalDateTime.now());

        if (nouveauStatut == StatutCommande.prete) {
            commande.setDatePret(LocalDateTime.now());
            // Notifier le client
            envoyerNotification(
                commande.getDocument().getClient(),
                "DOCUMENT_PRET",
                "Votre document \"" + commande.getDocument().getNomFichier()
                    + "\" est prêt. Vous pouvez venir le récupérer."
            );
        } else if (nouveauStatut == StatutCommande.refusee) {
            commande.setMotifRefus(request.getMotifRefus());
            // Notifier le client du refus
            envoyerNotification(
                commande.getDocument().getClient(),
                "DOCUMENT_REFUSE",
                "Votre document \"" + commande.getDocument().getNomFichier()
                    + "\" a été refusé. Motif : "
                    + (request.getMotifRefus() != null
                        ? request.getMotifRefus()
                        : "Non conforme")
            );
        }

        commande = commandeRepository.save(commande);
        return toResponse(commande);
    }

    private void envoyerNotification(
            Utilisateur destinataire,
            String type,
            String message) {

        Notification notification = Notification.builder()
                .destinataire(destinataire)
                .type(type)
                .message(message)
                .lu(false)
                .build();

        notificationRepository.save(notification);
    }

    private CommandeResponse toResponse(Commande commande) {
        return CommandeResponse.builder()
                .idCommande(commande.getIdCommande())
                .idDocument(commande.getDocument().getIdDocument())
                .nomFichier(commande.getDocument().getNomFichier())
                .nombrePages(commande.getDocument().getNombrePages())
                .typeImpression(commande.getDocument().getTarif()
                    .getTypeImpression().name())
                .disposition(commande.getDocument().getTarif()
                    .getDisposition().name())
                .commentaireClient(commande.getDocument().getCommentaireClient())
                .montantCalcule(commande.getMontantCalcule())
                .statut(commande.getStatut())
                .motifRefus(commande.getMotifRefus())
                .dateCreation(commande.getDateCreation())
                .dateTraitement(commande.getDateTraitement())
                .datePret(commande.getDatePret())
                .build();
    }
}