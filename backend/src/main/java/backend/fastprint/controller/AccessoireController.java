package backend.fastprint.controller;

import backend.fastprint.dto.ApiResponse;
import backend.fastprint.entity.Accessoire;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.service.AccessoireService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accessoires")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AccessoireController {

    private final AccessoireService accessoireService;

    // Catalogue public
    @GetMapping
    public ResponseEntity<ApiResponse<List<Accessoire>>> getCatalogue() {
        return ResponseEntity.ok(
            ApiResponse.success("Catalogue récupéré",
                accessoireService.getCatalogue())
        );
    }

    // Détail d'un accessoire
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Accessoire>> getAccessoireParId(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Accessoire récupéré",
                accessoireService.getAccessoireParId(id))
        );
    }

    // Gérant : publier un accessoire
    @PostMapping("/gerant")
    public ResponseEntity<ApiResponse<Accessoire>> publierAccessoire(
            @RequestBody Accessoire accessoire,
            @AuthenticationPrincipal Utilisateur gerant) {
        return ResponseEntity.ok(
            ApiResponse.success("Accessoire publié",
                accessoireService.publierAccessoire(accessoire, gerant))
        );
    }

    // Gérant : modifier un accessoire
    @PutMapping("/gerant/{id}")
    public ResponseEntity<ApiResponse<Accessoire>> modifierAccessoire(
            @PathVariable Long id,
            @RequestBody Accessoire accessoire) {
        return ResponseEntity.ok(
            ApiResponse.success("Accessoire modifié",
                accessoireService.modifierAccessoire(id, accessoire))
        );
    }

    // Gérant : désactiver un accessoire
    @DeleteMapping("/gerant/{id}")
    public ResponseEntity<ApiResponse<Void>> desactiverAccessoire(
            @PathVariable Long id) {
        accessoireService.desactiverAccessoire(id);
        return ResponseEntity.ok(
            ApiResponse.success("Accessoire désactivé", null)
        );
    }
}