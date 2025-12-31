package om.openclassrooms.mddapi.user.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import om.openclassrooms.mddapi.common.validation.ValidPassword;

public record ProfileUpdateRequest(
        @NotBlank
        String username,

        @NotBlank
        @Email
        String email,

        @ValidPassword
        String password
) {
}
