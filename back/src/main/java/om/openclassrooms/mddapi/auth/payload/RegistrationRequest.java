package om.openclassrooms.mddapi.auth.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import om.openclassrooms.mddapi.common.validation.ValidPassword;

public record RegistrationRequest (
    @NotBlank
    String username,

    @NotBlank
    @Email
    String email,

    @ValidPassword
    String password
) {}
