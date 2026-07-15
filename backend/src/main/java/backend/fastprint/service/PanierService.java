package backend.fastprint.service;

import backend.fastprint.dto.AjouterAuPanierRequest;
import backend.fastprint.entity.*;
import backend.fastprint.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PanierService {

    private final PanierRepository panierRepository;
    private final LignePanierRepository lignePanierRepository;
    private final AccessoireRepository accessoireRepository;
    private final CommandeAccessoireRepository commandeAccessoireRepository;
    private final LigneCommandeAccessoireRepository ligneCommandeAccessoireRepository;
    private final NotificationRepository notificationRepository;

    // Récupérer ou créer le panier du client
    public Panier getOuCreerPanier(Utilisateur client) {
        return panierRepository.findByClient(client)
                .orElseGet(() -> {
                    Panier panier = Panier.builder()
                            .client(client)
                            .build();
                    return panierRepository.save(panier);
                });
    }

    // Ajouter un article au panier
    public Panier ajouterAuPanier(
            Utilisateur client,
            AjouterAuPanierRequest request) {

        Panier panier = getOuCreerPanier(client);

        Accessoire accessoire = accessoireRepository.findById(request.getIdAccessoire())
                .orElseThrow(() -> new RuntimeException("Accessoire introuvable"));

        if (accessoire.getQuantiteStock() < request.getQuantite()) {
            throw new RuntimeException("Stock insuffisant");
        }

        // Vérifier si l'article est déjà dans le panier
        Optional<LignePanier> ligneExistante = panier.getLignes() != null
                ? panier.getLignes().stream()
                    .filter(l -> l.getAccessoire().getIdAccessoire()
                        .equals(request.getIdAccessoire()))
                    .findFirst()
                : Optional.empty();

        if (ligneExistante.isPresent()) {
            // Mettre à jour la quantité
            LignePanier ligne = ligneExistante.get();
            ligne.setQuantite(ligne.getQuantite() + request.getQuantite());
            lignePanierRepository.save(ligne);
        } else {
            // Ajouter une nouvelle ligne
            LignePanier ligne = LignePanier.builder()
                    .panier(panier)
                    .accessoire(accessoire)
                    .quantite(request.getQuantite())
                    .build();
            lignePanierRepository.save(ligne);
        }

        return panierRepository.findByClient(client).orElse(panier);
    }

    // Supprimer un article du panier
    public void supprimerDuPanier(Long idLigne, Utilisateur client) {
        LignePanier ligne = lignePanierRepository.findById(idLigne)
                .orElseThrow(() -> new RuntimeException("Article introuvable dans le panier"));

        if (!ligne.getPanier().getClient().getIdUtilisateur()
                .equals(client.getIdUtilisateur())) {
            throw new RuntimeException("Accès non autorisé");
        }

        lignePanierRepository.delete(ligne);
    }

    // Vider le panier
    public void viderPanier(Utilisateur client) {
        Panier panier = getOuCreerPanier(client);
        if (panier.getLignes() != null) {
            lignePanierRepository.deleteAll(panier.getLignes());
        }
    }

    // Valider le panier → crée une commande accessoire
    public CommandeAccessoire validerPanier(Utilisateur client) {
        Panier panier = panierRepository.findByClient(client)
                .orElseThrow(() -> new RuntimeException("Panier introuvable"));

        if (panier.getLignes() == null || panier.getLignes().isEmpty()) {
            throw new RuntimeException("Le panier est vide");
        }

        // Calculer le montant total
        BigDecimal montantTotal = panier.getLignes().stream()
                .map(l -> l.getAccessoire().getPrix()
                    .multiply(BigDecimal.valueOf(l.getQuantite())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Créer la commande
        CommandeAccessoire commande = CommandeAccessoire.builder()
                .client(client)
                .montantTotal(montantTotal)
                .statut(CommandeAccessoire.StatutCommande.en_attente)
                .build();

        commande = commandeAccessoireRepository.save(commande);

        // Créer les lignes de commande
        for (LignePanier ligne : panier.getLignes()) {
            LigneCommandeAccessoire ligneCommande = LigneCommandeAccessoire.builder()
                    .commandeAccessoire(commande)
                    .accessoire(ligne.getAccessoire())
                    .quantite(ligne.getQuantite())
                    .prixUnitaireAuMoment(ligne.getAccessoire().getPrix())
                    .build();
            ligneCommandeAccessoireRepository.save(ligneCommande);

            // Décrémenter le stock
            Accessoire accessoire = ligne.getAccessoire();
            accessoire.setQuantiteStock(
                accessoire.getQuantiteStock() - ligne.getQuantite()
            );
            accessoireRepository.save(accessoire);
        }

        // Vider le panier après validation
        lignePanierRepository.deleteAll(panier.getLignes());

        // Notifier le client
        Notification notification = Notification.builder()
                .destinataire(client)
                .type("COMMANDE_ACCESSOIRE_CREEE")
                .message("Votre commande de fournitures a été enregistrée. "
                    + "Montant total : " + montantTotal + " FCFA")
                .lu(false)
                .build();
        notificationRepository.save(notification);

        return commande;
    }
}