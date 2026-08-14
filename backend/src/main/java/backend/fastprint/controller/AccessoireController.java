package backend.fastprint.controller;

import backend.fastprint.dto.AccessoireRequest;
import backend.fastprint.dto.AccessoireResponse;
import backend.fastprint.dto.ApiResponse;
import backend.fastprint.entity.Accessoire;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.service.AccessoireService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/accessoires")
@RequiredArgsConstructor
public class AccessoireController {

    private final AccessoireService accessoireService;

    // Catalogue public
    @GetMapping
    public ResponseEntity<ApiResponse<List<AccessoireResponse>>> getCatalogue() {
        List<AccessoireResponse> catalogue = accessoireService.getCatalogue().stream()
            .map(this::toResponse)
            .toList();
        return ResponseEntity.ok(
            ApiResponse.success("Catalogue récupéré", catalogue)
        );
    }

    // Gérant : tous les accessoires (actifs + désactivés)
    @GetMapping("/gerant/tous")
    public ResponseEntity<ApiResponse<List<AccessoireResponse>>> getTousLesAccessoires() {
        List<AccessoireResponse> accessoires = accessoireService.getTousLesAccessoires().stream()
            .map(this::toResponse)
            .toList();
        return ResponseEntity.ok(
            ApiResponse.success("Accessoires récupérés", accessoires)
        );
    }

    // Détail d'un accessoire
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccessoireResponse>> getAccessoireParId(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Accessoire récupéré",
                toResponse(accessoireService.getAccessoireParId(id)))
        );
    }

    // Gérant : publier un accessoire (avec image optionnelle)
    @PostMapping(value = "/gerant", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<AccessoireResponse>> publierAccessoire(
            @ModelAttribute AccessoireRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal Utilisateur gerant) {
        return ResponseEntity.ok(
            ApiResponse.success("Accessoire publié",
                toResponse(accessoireService.publierAccessoire(request, image, gerant)))
        );
    }

    // Gérant : modifier un accessoire (avec remplacement d'image optionnel)
    @PutMapping(value = "/gerant/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<AccessoireResponse>> modifierAccessoire(
            @PathVariable Long id,
            @ModelAttribute AccessoireRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(
            ApiResponse.success("Accessoire modifié",
                toResponse(accessoireService.modifierAccessoire(id, request, image)))
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

    // Gérant : réactiver un accessoire
    @PutMapping("/gerant/{id}/reactiver")
    public ResponseEntity<ApiResponse<Void>> reactiverAccessoire(
            @PathVariable Long id) {
        accessoireService.reactiverAccessoire(id);
        return ResponseEntity.ok(
            ApiResponse.success("Accessoire réactivé", null)
        );
    }

    private AccessoireResponse toResponse(Accessoire accessoire) {
        return AccessoireResponse.builder()
            .idAccessoire(accessoire.getIdAccessoire())
            .nom(accessoire.getNom())
            .description(accessoire.getDescription())
            .prix(accessoire.getPrix())
            .quantiteStock(accessoire.getQuantiteStock())
            .imageUrl(accessoire.getCheminImage())
            .datePublication(accessoire.getDatePublication())
            .actif(accessoire.getActif())
            .build();
    }
}