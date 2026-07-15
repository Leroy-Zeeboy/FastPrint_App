package backend.fastprint.controller;

import backend.fastprint.dto.ApiResponse;
import backend.fastprint.entity.Tarif;
import backend.fastprint.service.TarifService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarifs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TarifController {

    private final TarifService tarifService;

    // GET /api/tarifs — accessible à tous (visiteur, client, gérant, admin)
    @GetMapping
    public ResponseEntity<ApiResponse<List<Tarif>>> getTousLesTarifs() {
        return ResponseEntity.ok(
            ApiResponse.success("Tarifs récupérés", tarifService.getTousLesTarifs())
        );
    }

    // GET /api/tarifs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Tarif>> getTarifParId(@PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Tarif récupéré", tarifService.getTarifParId(id))
        );
    }

    // POST /api/admin/tarifs — admin uniquement
    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<Tarif>> creerTarif(@RequestBody Tarif tarif) {
        return ResponseEntity.ok(
            ApiResponse.success("Tarif créé", tarifService.creerTarif(tarif))
        );
    }

    // PUT /api/admin/tarifs/{id} — admin uniquement
    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Tarif>> modifierTarif(
            @PathVariable Long id,
            @RequestBody Tarif tarif) {
        return ResponseEntity.ok(
            ApiResponse.success("Tarif modifié", tarifService.modifierTarif(id, tarif))
        );
    }

    // DELETE /api/admin/tarifs/{id} — admin uniquement
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> supprimerTarif(@PathVariable Long id) {
        tarifService.supprimerTarif(id);
        return ResponseEntity.ok(
            ApiResponse.success("Tarif supprimé", null)
        );
    }
}