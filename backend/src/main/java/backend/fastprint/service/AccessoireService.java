package backend.fastprint.service;

import backend.fastprint.dto.AccessoireRequest;
import backend.fastprint.entity.Accessoire;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.repository.AccessoireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccessoireService {

    private final AccessoireRepository accessoireRepository;
    private final CloudinaryService cloudinaryService;

    // Catalogue public — tous les accessoires actifs
    public List<Accessoire> getCatalogue() {
        return accessoireRepository.findByActifTrue();
    }

    // Gérant : tous les accessoires (actifs et désactivés)
    public List<Accessoire> getTousLesAccessoires() {
        return accessoireRepository.findAll();
    }

    // Détail d'un accessoire
    public Accessoire getAccessoireParId(Long id) {
        return accessoireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accessoire introuvable"));
    }

    // Gérant : publier un accessoire (avec image optionnelle)
    public Accessoire publierAccessoire(
            AccessoireRequest request,
            MultipartFile image,
            Utilisateur gerant) {

        Accessoire accessoire = Accessoire.builder()
                .nom(request.getNom())
                .description(request.getDescription())
                .prix(request.getPrix())
                .quantiteStock(request.getQuantiteStock())
                .publiePar(gerant)
                .actif(true)
                .build();

        if (image != null && !image.isEmpty()) {
            accessoire.setCheminImage(enregistrerImage(image));
        }

        return accessoireRepository.save(accessoire);
    }

    // Gérant : modifier un accessoire (avec remplacement d'image optionnel)
    public Accessoire modifierAccessoire(
            Long id,
            AccessoireRequest request,
            MultipartFile image) {

        Accessoire accessoire = getAccessoireParId(id);
        accessoire.setNom(request.getNom());
        accessoire.setDescription(request.getDescription());
        accessoire.setPrix(request.getPrix());
        accessoire.setQuantiteStock(request.getQuantiteStock());

        if (image != null && !image.isEmpty()) {
            accessoire.setCheminImage(enregistrerImage(image));
        }

        return accessoireRepository.save(accessoire);
    }

    // Gérant : désactiver un accessoire
    public void desactiverAccessoire(Long id) {
        Accessoire accessoire = getAccessoireParId(id);
        accessoire.setActif(false);
        accessoireRepository.save(accessoire);
    }

    // Gérant : réactiver un accessoire
    public void reactiverAccessoire(Long id) {
        Accessoire accessoire = getAccessoireParId(id);
        accessoire.setActif(true);
        accessoireRepository.save(accessoire);
    }

    // Upload l'image vers Cloudinary et renvoie son URL publique permanente
    private String enregistrerImage(MultipartFile image) {
        try {
            return cloudinaryService.uploadFichier(image, "accessoires");
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'enregistrement de l'image", e);
        }
    }
}