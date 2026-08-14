package backend.fastprint.controller;

import backend.fastprint.dto.ApiResponse;
import backend.fastprint.dto.AjouterAuPanierRequest;
import backend.fastprint.dto.CommandeAccessoireResponse;
import backend.fastprint.dto.PanierResponse;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.service.PanierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/panier")
@RequiredArgsConstructor
public class PanierController {

    private final PanierService panierService;

    // Voir son panier
    @GetMapping
    public ResponseEntity<ApiResponse<PanierResponse>> getMonPanier(
            @AuthenticationPrincipal Utilisateur client) {
        return ResponseEntity.ok(
            ApiResponse.success("Panier récupéré",
                panierService.getMonPanier(client))
        );
    }

    // Ajouter un article au panier
    @PostMapping
    public ResponseEntity<ApiResponse<PanierResponse>> ajouterAuPanier(
            @Valid @RequestBody AjouterAuPanierRequest request,
            @AuthenticationPrincipal Utilisateur client) {
        return ResponseEntity.ok(
            ApiResponse.success("Article ajouté au panier",
                panierService.ajouterAuPanier(client, request))
        );
    }

    // Supprimer un article du panier
    @DeleteMapping("/{idLigne}")
    public ResponseEntity<ApiResponse<Void>> supprimerDuPanier(
            @PathVariable Long idLigne,
            @AuthenticationPrincipal Utilisateur client) {
        panierService.supprimerDuPanier(idLigne, client);
        return ResponseEntity.ok(
            ApiResponse.success("Article supprimé du panier", null)
        );
    }

    // Vider le panier
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> viderPanier(
            @AuthenticationPrincipal Utilisateur client) {
        panierService.viderPanier(client);
        return ResponseEntity.ok(
            ApiResponse.success("Panier vidé", null)
        );
    }

    // Valider le panier → crée une commande
    @PostMapping("/valider")
    public ResponseEntity<ApiResponse<CommandeAccessoireResponse>> validerPanier(
            @AuthenticationPrincipal Utilisateur client) {
        return ResponseEntity.ok(
            ApiResponse.success("Commande créée avec succès",
                panierService.validerPanier(client))
        );
    }
}