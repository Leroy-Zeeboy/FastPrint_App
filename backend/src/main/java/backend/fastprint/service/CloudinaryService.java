package backend.fastprint.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    /**
     * Upload un fichier (image ou document) vers Cloudinary.
     * @param fichier le fichier envoyé par le client
     * @param dossier le sous-dossier Cloudinary de rangement (ex: "documents", "accessoires")
     * @return l'URL publique et permanente du fichier
     */
    public String uploadFichier(MultipartFile fichier, String dossier) throws IOException {
        String resourceType = "documents".equals(dossier) ? "raw" : "auto";

        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                fichier.getBytes(),
                ObjectUtils.asMap(
                        "folder", dossier,
                        "resource_type", resourceType
                )
        );
        return (String) uploadResult.get("secure_url");
    }
}