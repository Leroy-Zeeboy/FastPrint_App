package backend.fastprint.service;

import backend.fastprint.entity.OptionFinition;
import backend.fastprint.repository.OptionFinitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OptionFinitionService {

    private final OptionFinitionRepository optionFinitionRepository;

    public List<OptionFinition> getToutesLesOptions() {
        return optionFinitionRepository.findAll();
    }

    public List<OptionFinition> getOptionsActives() {
        return optionFinitionRepository.findByActifTrue();
    }

    public OptionFinition getOptionParId(Long id) {
        return optionFinitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Option de finition introuvable"));
    }

    public OptionFinition creerOption(OptionFinition option) {
        option.setActif(true);
        return optionFinitionRepository.save(option);
    }

    public OptionFinition modifierOption(Long id, OptionFinition optionModifiee) {
        OptionFinition option = getOptionParId(id);
        option.setCategorie(optionModifiee.getCategorie());
        option.setLibelle(optionModifiee.getLibelle());
        option.setSurCout(optionModifiee.getSurCout());
        return optionFinitionRepository.save(option);
    }

    public void desactiverOption(Long id) {
        OptionFinition option = getOptionParId(id);
        option.setActif(false);
        optionFinitionRepository.save(option);
    }
}