package backend.fastprint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long idNotification;
    private String type;
    private String message;
    private Boolean lu;
    private LocalDateTime dateEnvoi;
}