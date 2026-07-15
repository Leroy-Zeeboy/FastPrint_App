package backend.fastprint.controller;

import backend.fastprint.dto.ApiResponse;
import backend.fastprint.dto.CommandeResponse;
import backend.fastprint.dto.TraiterCommandeRequest;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.service.CommandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommandeController {

    private final CommandeService commandeService;

    // Client : historique de ses commandes
    @GetMapping("/mes-commandes")
    public ResponseEntity<ApiResponse<List<CommandeResponse>>> getMesCommandes(
            @AuthenticationPrincipal Utilisateur client) {
        return ResponseEntity.ok(
            ApiResponse.success("Commandes récupérées",
                commandeService.getMesCommandes(client))
        );
    }

    // Gérant : liste des commandes en attente
    @GetMapping("/en-attente")
    public ResponseEntity<ApiResponse<List<CommandeResponse>>> getCommandesEnAttente() {
        return ResponseEntity.ok(
            ApiResponse.success("Commandes en attente récupérées",
                commandeService.getCommandesEnAttente())
        );
    }

    // Gérant : détail d'une commande
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CommandeResponse>> getCommandeParId(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Commande récupérée",
                commandeService.getCommandeParId(id))
        );
    }

    // Gérant : traiter une commande
    @PutMapping("/{id}/traiter")
    public ResponseEntity<ApiResponse<CommandeResponse>> traiterCommande(
            @PathVariable Long id,
            @RequestBody TraiterCommandeRequest request,
            @AuthenticationPrincipal Utilisateur gerant) {
        return ResponseEntity.ok(
            ApiResponse.success("Commande traitée",
                commandeService.traiterCommande(id, request, gerant))
        );
    }
}