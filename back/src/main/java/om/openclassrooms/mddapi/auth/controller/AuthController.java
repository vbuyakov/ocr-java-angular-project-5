package om.openclassrooms.mddapi.auth.controller;

import jakarta.validation.Valid;
import om.openclassrooms.mddapi.auth.payload.LoginRequest;
import om.openclassrooms.mddapi.auth.payload.LoginResponse;
import om.openclassrooms.mddapi.auth.payload.RegistrationRequest;
import om.openclassrooms.mddapi.auth.service.AuthService;
import om.openclassrooms.mddapi.common.payload.MessageResponse;
import om.openclassrooms.mddapi.common.utils.MessageResolver;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final MessageResolver messageResolver;

    public AuthController(AuthService authService, MessageResolver messageResolver) {
        this.authService = authService;
        this.messageResolver = messageResolver;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest){
        String token = this.authService.loginUser(loginRequest);
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegistrationRequest registrationRequest){
        this.authService.registerUser(registrationRequest);
        String message = messageResolver.get("auth.registration.success");
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse(message));
    }

}
