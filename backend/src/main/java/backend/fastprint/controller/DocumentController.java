package backend.fastprint.controller;

import backend.fastprint.dto.ApiResponse;
import backend.fastprint.dto.DocumentRequest;
import backend.fastprint.dto.DocumentResponse;
import backend.fastprint.entity.Utilisateur;
import backend.fastprint.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    // Dépôt d'un document par le client
    @PostMapping
    public ResponseEntity<ApiResponse<DocumentResponse>> deposerDocument(
            @RequestParam("fichier") MultipartFile fichier,
            @Valid @ModelAttribute DocumentRequest request,
            @AuthenticationPrincipal Utilisateur client) {

        DocumentResponse response = documentService.deposerDocument(
            request, client, fichier
        );
        return ResponseEntity.ok(
            ApiResponse.success("Document déposé avec succès", response)
        );
    }

    // Historique des documents du client connecté
    @GetMapping("/mes-documents")
    public ResponseEntity<ApiResponse<List<?>>> getMesDocuments(
            @AuthenticationPrincipal Utilisateur client) {
        return ResponseEntity.ok(
            ApiResponse.success("Documents récupérés",
                documentService.getMesDocuments(client))
        );
    }

    // Récupération de l'URL de téléchargement (gérant/administrateur)
    @GetMapping("/{id}/telecharger")
    public ResponseEntity<ApiResponse<String>> getUrlTelechargement(
            @PathVariable("id") Long idDocument) {
        String url = documentService.getCheminFichier(idDocument);
        return ResponseEntity.ok(
            ApiResponse.success("URL de téléchargement récupérée", url)
        );
    }
}