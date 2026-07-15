package backend.fastprint.service;

import backend.fastprint.entity.Accessoire;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.repository.AccessoireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccessoireService {

    private final AccessoireRepository accessoireRepository;

    // Catalogue public — tous les accessoires actifs
    public List<Accessoire> getCatalogue() {
        return accessoireRepository.findByActifTrue();
    }

    // Détail d'un accessoire
    public Accessoire getAccessoireParId(Long id) {
        return accessoireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accessoire introuvable"));
    }

    // Gérant : publier un accessoire
    public Accessoire publierAccessoire(Accessoire accessoire, Utilisateur gerant) {
    accessoire.setPubliePar(gerant);
    accessoire.setActif(true);
    return accessoireRepository.save(accessoire);
}

    // Gérant : modifier un accessoire
    public Accessoire modifierAccessoire(Long id, Accessoire accessoireModifie) {
        Accessoire accessoire = getAccessoireParId(id);
        accessoire.setNom(accessoireModifie.getNom());
        accessoire.setDescription(accessoireModifie.getDescription());
        accessoire.setPrix(accessoireModifie.getPrix());
        accessoire.setQuantiteStock(accessoireModifie.getQuantiteStock());
        return accessoireRepository.save(accessoire);
    }

    // Gérant : désactiver un accessoire
    public void desactiverAccessoire(Long id) {
        Accessoire accessoire = getAccessoireParId(id);
        accessoire.setActif(false);
        accessoireRepository.save(accessoire);
    }
}