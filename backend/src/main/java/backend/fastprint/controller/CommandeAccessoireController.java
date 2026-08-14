package backend.fastprint.controller;

import backend.fastprint.dto.ApiResponse;
import backend.fastprint.dto.CommandeAccessoireResponse;
import backend.fastprint.dto.TraiterCommandeAccessoireRequest;
import backend.fastprint.service.CommandeAccessoireService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes-accessoires")
@RequiredArgsConstructor
public class CommandeAccessoireController {

    private final CommandeAccessoireService commandeAccessoireService;

    // Gérant : toutes les commandes d'accessoires
    @GetMapping
    public ResponseEntity<ApiResponse<List<CommandeAccessoireResponse>>> getToutesLesCommandes() {
        return ResponseEntity.ok(
            ApiResponse.success("Commandes récupérées",
                commandeAccessoireService.getToutesLesCommandes())
        );
    }

    // Gérant : commandes en attente uniquement
    @GetMapping("/en-attente")
    public ResponseEntity<ApiResponse<List<CommandeAccessoireResponse>>> getCommandesEnAttente() {
        return ResponseEntity.ok(
            ApiResponse.success("Commandes en attente récupérées",
                commandeAccessoireService.getCommandesEnAttente())
        );
    }

    // Gérant : marquer une commande comme prête / récupérée
    @PutMapping("/{id}/traiter")
    public ResponseEntity<ApiResponse<CommandeAccessoireResponse>> traiterCommande(
            @PathVariable Long id,
            @RequestBody TraiterCommandeAccessoireRequest request) {
        return ResponseEntity.ok(
            ApiResponse.success("Commande mise à jour",
                commandeAccessoireService.traiterCommande(id, request))
        );
    }
}