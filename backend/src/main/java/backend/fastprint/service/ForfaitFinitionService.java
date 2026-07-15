package backend.fastprint.service;

import backend.fastprint.entity.ForfaitFinition;
import backend.fastprint.repository.ForfaitFinitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ForfaitFinitionService {

    private final ForfaitFinitionRepository forfaitFinitionRepository;

    public List<ForfaitFinition> getTousLesForfaits() {
        return forfaitFinitionRepository.findAll();
    }

    public ForfaitFinition getForfaitParId(Long id) {
        return forfaitFinitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Forfait introuvable"));
    }

    public ForfaitFinition creerForfait(ForfaitFinition forfait) {
        if (forfait.getPalierMax() < forfait.getPalierMin()) {
            throw new RuntimeException("palier_max doit être supérieur ou égal à palier_min");
        }
        return forfaitFinitionRepository.save(forfait);
    }

    public ForfaitFinition modifierForfait(Long id, ForfaitFinition forfaitModifie) {
        ForfaitFinition forfait = getForfaitParId(id);
        if (forfaitModifie.getPalierMax() < forfaitModifie.getPalierMin()) {
            throw new RuntimeException("palier_max doit être supérieur ou égal à palier_min");
        }
        forfait.setType(forfaitModifie.getType());
        forfait.setPalierMin(forfaitModifie.getPalierMin());
        forfait.setPalierMax(forfaitModifie.getPalierMax());
        forfait.setPrix(forfaitModifie.getPrix());
        return forfaitFinitionRepository.save(forfait);
    }

    public void supprimerForfait(Long id) {
        ForfaitFinition forfait = getForfaitParId(id);
        forfaitFinitionRepository.delete(forfait);
    }
}