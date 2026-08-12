package backend.fastprint.controller;

import backend.fastprint.dto.ApiResponse;
import backend.fastprint.entity.OptionFinition;
import backend.fastprint.service.OptionFinitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/options-finition")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OptionFinitionController {

    private final OptionFinitionService optionFinitionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OptionFinition>>> getOptionsActives() {
        return ResponseEntity.ok(
            ApiResponse.success("Options récupérées",
                optionFinitionService.getOptionsActives())
        );
    }

    // Admin : toutes les options (actives et désactivées)
    @GetMapping("/admin/toutes")
    public ResponseEntity<ApiResponse<List<OptionFinition>>> getToutesLesOptions() {
        return ResponseEntity.ok(
            ApiResponse.success("Options récupérées",
                optionFinitionService.getToutesLesOptions())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OptionFinition>> getOptionParId(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Option récupérée",
                optionFinitionService.getOptionParId(id))
        );
    }

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<OptionFinition>> creerOption(
            @RequestBody OptionFinition option) {
        return ResponseEntity.ok(
            ApiResponse.success("Option créée",
                optionFinitionService.creerOption(option))
        );
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<OptionFinition>> modifierOption(
            @PathVariable Long id,
            @RequestBody OptionFinition option) {
        return ResponseEntity.ok(
            ApiResponse.success("Option modifiée",
                optionFinitionService.modifierOption(id, option))
        );
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> desactiverOption(
            @PathVariable Long id) {
        optionFinitionService.desactiverOption(id);
        return ResponseEntity.ok(
            ApiResponse.success("Option désactivée", null)
        );
    }

    @PutMapping("/admin/{id}/activer")
    public ResponseEntity<ApiResponse<Void>> activerOption(
            @PathVariable Long id) {
        optionFinitionService.activerOption(id);
        return ResponseEntity.ok(
            ApiResponse.success("Option réactivée", null)
        );
    }
}