package backend.fastprint.controller;

import backend.fastprint.dto.ApiResponse;
import backend.fastprint.entity.ForfaitFinition;
import backend.fastprint.service.ForfaitFinitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forfaits")
@RequiredArgsConstructor
public class ForfaitFinitionController {

    private final ForfaitFinitionService forfaitFinitionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ForfaitFinition>>> getTousLesForfaits() {
        return ResponseEntity.ok(
            ApiResponse.success("Forfaits récupérés",
                forfaitFinitionService.getTousLesForfaits())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ForfaitFinition>> getForfaitParId(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Forfait récupéré",
                forfaitFinitionService.getForfaitParId(id))
        );
    }

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<ForfaitFinition>> creerForfait(
            @RequestBody ForfaitFinition forfait) {
        return ResponseEntity.ok(
            ApiResponse.success("Forfait créé",
                forfaitFinitionService.creerForfait(forfait))
        );
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<ForfaitFinition>> modifierForfait(
            @PathVariable Long id,
            @RequestBody ForfaitFinition forfait) {
        return ResponseEntity.ok(
            ApiResponse.success("Forfait modifié",
                forfaitFinitionService.modifierForfait(id, forfait))
        );
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> supprimerForfait(
            @PathVariable Long id) {
        forfaitFinitionService.supprimerForfait(id);
        return ResponseEntity.ok(
            ApiResponse.success("Forfait supprimé", null)
        );
    }
}