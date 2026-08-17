package backend.fastprint.service;

import backend.fastprint.dto.DocumentRequest;
import backend.fastprint.dto.DocumentResponse;
import backend.fastprint.entity.*;
import backend.fastprint.entity.Tarif.TypeImpression;
import backend.fastprint.entity.Tarif.Disposition;
import backend.fastprint.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final TarifRepository tarifRepository;
    private final ForfaitFinitionRepository forfaitFinitionRepository;
    private final OptionFinitionRepository optionFinitionRepository;
    private final CommandeRepository commandeRepository;
    private final CloudinaryService cloudinaryService;

    // Délai de conservation par défaut : 3 jours
    private static final int DELAI_CONSERVATION_JOURS = 3;

    public DocumentResponse deposerDocument(
            DocumentRequest request,
            Utilisateur client,
            MultipartFile fichier) {

        String nomFichier = fichier.getOriginalFilename();
        String typeFichier = nomFichier != null && nomFichier.contains(".")
                ? nomFichier.substring(nomFichier.lastIndexOf(".") + 1)
                : "inconnu";

        // 0. Upload du fichier vers Cloudinary (persistant, contrairement au disque Render)
        String cheminFichier;
        try {
            cheminFichier = cloudinaryService.uploadFichier(fichier, "documents");
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'upload du fichier", e);
        }

        // 1. Récupérer le tarif correspondant
        TypeImpression typeImpression = TypeImpression.valueOf(request.getTypeImpression());
        Disposition disposition = Disposition.valueOf(request.getDisposition());

        Tarif tarif = tarifRepository
                .findByTypeImpressionAndDisposition(typeImpression, disposition)
                .orElseThrow(() -> new RuntimeException("Tarif introuvable pour ces options"));

        // 2. Récupérer le forfait si choisi
        ForfaitFinition forfait = null;
        if (request.getIdForfaitFinition() != null) {
            forfait = forfaitFinitionRepository.findById(request.getIdForfaitFinition())
                    .orElseThrow(() -> new RuntimeException("Forfait introuvable"));
        }

        // 3. Récupérer les options à la carte si choisies
        List<OptionFinition> options = List.of();
        if (request.getIdsOptionsFinition() != null
                && !request.getIdsOptionsFinition().isEmpty()) {
            options = optionFinitionRepository
                    .findAllById(request.getIdsOptionsFinition());
        }

        // 4. Calculer le montant automatiquement (section 4.6 du cahier des charges)
        BigDecimal montant = calculerMontant(
            request.getNombrePages(), tarif, forfait, options
        );

        // 5. Créer le document
        Document document = Document.builder()
                .client(client)
                .nomFichier(nomFichier)
                .typeFichier(typeFichier)
                .cheminFichier(cheminFichier)
                .nombrePages(request.getNombrePages())
                .tarif(tarif)
                .forfaitFinition(forfait)
                .optionsFinition(options)
                .commentaireClient(request.getCommentaireClient())
                .dateExpiration(LocalDateTime.now()
                    .plusDays(DELAI_CONSERVATION_JOURS))
                .build();

        document = documentRepository.save(document);

        // 6. Créer la commande associée automatiquement
        Commande commande = Commande.builder()
                .document(document)
                .montantCalcule(montant)
                .statut(Commande.StatutCommande.en_attente)
                .build();

        commandeRepository.save(commande);

        return toResponse(document, montant);
    }

    // Formule section 4.6 du cahier des charges :
    // Montant = (prix/page × pages) + forfait (si choisi) + Σ sur-coûts options
    private BigDecimal calculerMontant(
            int nombrePages,
            Tarif tarif,
            ForfaitFinition forfait,
            List<OptionFinition> options) {

        BigDecimal montant = tarif.getPrixUnitaire()
                .multiply(BigDecimal.valueOf(nombrePages));

        if (forfait != null) {
            montant = montant.add(forfait.getPrix());
        }

        for (OptionFinition option : options) {
            montant = montant.add(option.getSurCout());
        }

        return montant;
    }

    public List<Document> getMesDocuments(Utilisateur client) {
        return documentRepository.findByClient(client);
    }

    public String getCheminFichier(Long idDocument) {
        Document doc = documentRepository.findById(idDocument)
                .orElseThrow(() -> new RuntimeException("Document introuvable"));
        return doc.getCheminFichier();
    }

    private DocumentResponse toResponse(Document document, BigDecimal montant) {
        return DocumentResponse.builder()
                .idDocument(document.getIdDocument())
                .nomFichier(document.getNomFichier())
                .typeFichier(document.getTypeFichier())
                .nombrePages(document.getNombrePages())
                .typeImpression(document.getTarif().getTypeImpression().name())
                .disposition(document.getTarif().getDisposition().name())
                .commentaireClient(document.getCommentaireClient())
                .montantCalcule(montant)
                .dateDepot(document.getDateDepot())
                .dateExpiration(document.getDateExpiration())
                .statutConservation(document.getStatutConservation())
                .build();
    }
}