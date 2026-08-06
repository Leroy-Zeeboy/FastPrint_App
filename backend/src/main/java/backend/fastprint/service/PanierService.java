package backend.fastprint.service;

import backend.fastprint.dto.AjouterAuPanierRequest;
import backend.fastprint.dto.CommandeAccessoireResponse;
import backend.fastprint.dto.LigneCommandeAccessoireResponse;
import backend.fastprint.dto.LignePanierResponse;
import backend.fastprint.dto.PanierResponse;
import backend.fastprint.entity.*;
import backend.fastprint.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    // --- Récupérer ou créer le panier du client (entité interne) ---
    private Panier getOuCreerPanierEntite(Utilisateur client) {
        Panier panier = panierRepository.findByClient(client)
                .orElseGet(() -> {
                    Panier nouveau = Panier.builder()
                            .client(client)
                            .build();
                    return panierRepository.save(nouveau);
                });
        System.out.println(">>> [Panier] id=" + panier.getIdPanier()
            + " pour client=" + client.getEmail());
        return panier;
    }

    // Voir son panier (exposé au controller)
    public PanierResponse getMonPanier(Utilisateur client) {
        return toPanierResponse(getOuCreerPanierEntite(client));
    }

    // Ajouter un article au panier
    public PanierResponse ajouterAuPanier(
            Utilisateur client,
            AjouterAuPanierRequest request) {

        Panier panier = getOuCreerPanierEntite(client);

        Accessoire accessoire = accessoireRepository.findById(request.getIdAccessoire())
                .orElseThrow(() -> new RuntimeException("Accessoire introuvable"));

        if (accessoire.getQuantiteStock() < request.getQuantite()) {
            throw new RuntimeException("Stock insuffisant");
        }

        List<LignePanier> lignesActuelles = lignePanierRepository.findByPanier(panier);
        System.out.println(">>> [Panier] lignes actuelles avant ajout: " + lignesActuelles.size());

        Optional<LignePanier> ligneExistante = lignesActuelles.stream()
                .filter(l -> l.getAccessoire().getIdAccessoire()
                    .equals(request.getIdAccessoire()))
                .findFirst();

        if (ligneExistante.isPresent()) {
            LignePanier ligne = ligneExistante.get();
            ligne.setQuantite(ligne.getQuantite() + request.getQuantite());
            lignePanierRepository.save(ligne);
        } else {
            LignePanier ligne = LignePanier.builder()
                    .panier(panier)
                    .accessoire(accessoire)
                    .quantite(request.getQuantite())
                    .build();
            lignePanierRepository.save(ligne);
        }

        return toPanierResponse(panier);
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

    // Vider le panier — suppression directe par requête (fiable, ignore l'état
    // potentiellement obsolète d'une collection chargée en lazy)
    @Transactional
    public void viderPanier(Utilisateur client) {
        Panier panier = getOuCreerPanierEntite(client);
        int avant = lignePanierRepository.findByPanier(panier).size();
        lignePanierRepository.deleteByPanier(panier);
        int apres = lignePanierRepository.findByPanier(panier).size();
        System.out.println(">>> [Panier] viderPanier — lignes avant=" + avant
            + " après=" + apres);
    }

    // Valider le panier → crée une commande accessoire
    @Transactional
    public CommandeAccessoireResponse validerPanier(Utilisateur client) {
        Panier panier = getOuCreerPanierEntite(client);

        List<LignePanier> lignes = lignePanierRepository.findByPanier(panier);
        System.out.println(">>> [Panier] validerPanier — lignes trouvées: " + lignes.size());

        if (lignes.isEmpty()) {
            throw new RuntimeException("Le panier est vide");
        }

        // Calculer le montant total
        BigDecimal montantTotal = lignes.stream()
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
        for (LignePanier ligne : lignes) {
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

        // Vider le panier après validation — suppression directe par requête
        lignePanierRepository.deleteByPanier(panier);
        int restantes = lignePanierRepository.findByPanier(panier).size();
        System.out.println(">>> [Panier] validerPanier — lignes restantes après suppression: "
            + restantes);

        // Notifier le client
        Notification notification = Notification.builder()
                .destinataire(client)
                .type("COMMANDE_ACCESSOIRE_CREEE")
                .message("Votre commande de fournitures a été enregistrée. "
                    + "Montant total : " + montantTotal + " FCFA")
                .lu(false)
                .build();
        notificationRepository.save(notification);

        CommandeAccessoire commandeAvecLignes = commandeAccessoireRepository
                .findById(commande.getIdCommandeAccessoire())
                .orElse(commande);

        return toCommandeAccessoireResponse(commandeAvecLignes);
    }

    // --- Mapping vers DTOs (évite la boucle de sérialisation JSON) ---

    private PanierResponse toPanierResponse(Panier panier) {
        List<LignePanier> lignesEntite = lignePanierRepository.findByPanier(panier);

        List<LignePanierResponse> lignes = lignesEntite.stream()
                .map(this::toLignePanierResponse)
                .toList();

        BigDecimal montantTotal = lignes.stream()
                .map(LignePanierResponse::getSousTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return PanierResponse.builder()
                .idPanier(panier.getIdPanier())
                .dateCreation(panier.getDateCreation())
                .lignes(lignes)
                .montantTotal(montantTotal)
                .build();
    }

    private LignePanierResponse toLignePanierResponse(LignePanier ligne) {
        BigDecimal prixUnitaire = ligne.getAccessoire().getPrix();
        BigDecimal sousTotal = prixUnitaire.multiply(BigDecimal.valueOf(ligne.getQuantite()));

        return LignePanierResponse.builder()
                .idLignePanier(ligne.getIdLignePanier())
                .idAccessoire(ligne.getAccessoire().getIdAccessoire())
                .nomAccessoire(ligne.getAccessoire().getNom())
                .prixUnitaire(prixUnitaire)
                .quantite(ligne.getQuantite())
                .sousTotal(sousTotal)
                .build();
    }

    private CommandeAccessoireResponse toCommandeAccessoireResponse(CommandeAccessoire commande) {
        List<LigneCommandeAccessoireResponse> lignes = commande.getLignes() == null
                ? List.of()
                : commande.getLignes().stream()
                    .map(this::toLigneCommandeAccessoireResponse)
                    .toList();

        return CommandeAccessoireResponse.builder()
                .idCommandeAccessoire(commande.getIdCommandeAccessoire())
                .montantTotal(commande.getMontantTotal())
                .statut(commande.getStatut())
                .dateCreation(commande.getDateCreation())
                .datePret(commande.getDatePret())
                .lignes(lignes)
                .build();
    }

    private LigneCommandeAccessoireResponse toLigneCommandeAccessoireResponse(
            LigneCommandeAccessoire ligne) {
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