package backend.fastprint.service;

import backend.fastprint.dto.TarifResponse;
import backend.fastprint.entity.Tarif;
import backend.fastprint.repository.TarifRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TarifService {

    private final TarifRepository tarifRepository;

    // Récupérer tous les tarifs (accessible à tous)
    public List<TarifResponse> getTousLesTarifs() {
    return tarifRepository.findAll().stream()
        .map(t -> TarifResponse.builder()
            .idTarif(t.getIdTarif())
            .typeImpression(t.getTypeImpression().name())
            .disposition(t.getDisposition().name())
            .prixUnitaire(t.getPrixUnitaire())
            .build())
        .toList();
}
    // Récupérer un tarif par ID
    public Tarif getTarifParId(Long id) {
        return tarifRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarif introuvable"));
    }

    // Créer un nouveau tarif (admin uniquement)
    public Tarif creerTarif(Tarif tarif) {
        return tarifRepository.save(tarif);
    }

    // Modifier un tarif existant (admin uniquement)
    public Tarif modifierTarif(Long id, Tarif tarifModifie) {
    Tarif tarif = getTarifParId(id);
    // On modifie uniquement le prix, pas le type/disposition
    // (la contrainte uq_tarif_combinaison l'interdit)
    tarif.setPrixUnitaire(tarifModifie.getPrixUnitaire());
    return tarifRepository.save(tarif);
}
    // Supprimer un tarif (admin uniquement)
    public void supprimerTarif(Long id) {
        Tarif tarif = getTarifParId(id);
        tarifRepository.delete(tarif);
    }
}