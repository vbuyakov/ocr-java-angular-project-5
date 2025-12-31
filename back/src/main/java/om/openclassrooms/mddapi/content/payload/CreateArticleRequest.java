package om.openclassrooms.mddapi.content.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record CreateArticleRequest(
        @NotEmpty
        @Size(max = 255)
        String title,

        @NotEmpty
        @Size(max = 10000)
        String content,

        @NotEmpty
        Long topicId
) {
}
