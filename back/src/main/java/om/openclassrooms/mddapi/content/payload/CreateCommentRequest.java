package om.openclassrooms.mddapi.content.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCommentRequest(
        @NotBlank
        @Size(max = 500)
        String content,

        @NotBlank
        Long articleId
) {
}
