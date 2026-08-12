package backend.fastprint.dto;

import lombok.Data;

@Data
public class ModifierRoleRequest {
    private String role; // "client", "gerant", "administrateur"
}