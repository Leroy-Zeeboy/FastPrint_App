package backend.fastprint.controller;

import backend.fastprint.dto.ApiResponse;
import backend.fastprint.dto.AuthResponse;
import backend.fastprint.dto.LoginRequest;
import backend.fastprint.dto.RegisterRequest;
import backend.fastprint.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/inscription")
    public ResponseEntity<ApiResponse<AuthResponse>> inscrire(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.inscrire(request);
        return ResponseEntity.ok(
            ApiResponse.success("Inscription réussie", response)
        );
    }

    @PostMapping("/connexion")
    public ResponseEntity<ApiResponse<AuthResponse>> connecter(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.connecter(request);
        return ResponseEntity.ok(
            ApiResponse.success("Connexion réussie", response)
        );
    }
}