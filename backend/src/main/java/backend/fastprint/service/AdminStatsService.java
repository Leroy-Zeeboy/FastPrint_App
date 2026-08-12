package backend.fastprint.service;

import backend.fastprint.dto.StatsResponse;
import backend.fastprint.entity.Accessoire;
import backend.fastprint.entity.Commande;
import backend.fastprint.entity.Commande.StatutCommande;
import backend.fastprint.entity.CommandeAccessoire;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.entity.Utilisateur.Role;
import backend.fastprint.repository.AccessoireRepository;
import backend.fastprint.repository.CommandeAccessoireRepository;
import backend.fastprint.repository.CommandeRepository;
import backend.fastprint.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UtilisateurRepository utilisateurRepository;
    private final CommandeRepository commandeRepository;
    private final CommandeAccessoireRepository commandeAccessoireRepository;
    private final AccessoireRepository accessoireRepository;

    public StatsResponse getStats() {
        List<Utilisateur> utilisateurs = utilisateurRepository.findAll();
        long totalClients = utilisateurs.stream()
                .filter(u -> u.getRole() == Role.client).count();
        long totalGerants = utilisateurs.stream()
                .filter(u -> u.getRole() == Role.gerant).count();
        long totalAdministrateurs = utilisateurs.stream()
                .filter(u -> u.getRole() == Role.administrateur).count();

        List<Commande> commandes = commandeRepository.findAll();
        long enAttente = commandes.stream()
                .filter(c -> c.getStatut() == StatutCommande.en_attente).count();
        long pretes = commandes.stream()
                .filter(c -> c.getStatut() == StatutCommande.prete).count();
        long refusees = commandes.stream()
                .filter(c -> c.getStatut() == StatutCommande.refusee).count();
        BigDecimal caDocuments = commandes.stream()
                .filter(c -> c.getStatut() == StatutCommande.prete)
                .map(Commande::getMontantCalcule)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CommandeAccessoire> commandesAccessoires = commandeAccessoireRepository.findAll();
        long accessoiresEnAttente = commandesAccessoires.stream()
                .filter(c -> c.getStatut() == CommandeAccessoire.StatutCommande.en_attente)
                .count();
        BigDecimal caAccessoires = commandesAccessoires.stream()
                .map(CommandeAccessoire::getMontantTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long accessoiresActifs = accessoireRepository.findAll().stream()
                .filter(Accessoire::getActif)
                .count();

        return StatsResponse.builder()
                .totalUtilisateurs(utilisateurs.size())
                .totalClients(totalClients)
                .totalGerants(totalGerants)
                .totalAdministrateurs(totalAdministrateurs)
                .totalCommandesDocuments(commandes.size())
                .commandesDocumentsEnAttente(enAttente)
                .commandesDocumentsPretes(pretes)
                .commandesDocumentsRefusees(refusees)
                .chiffreAffairesDocuments(caDocuments)
                .totalCommandesAccessoires(commandesAccessoires.size())
                .commandesAccessoiresEnAttente(accessoiresEnAttente)
                .chiffreAffairesAccessoires(caAccessoires)
                .totalAccessoiresActifs(accessoiresActifs)
                .build();
    }
}