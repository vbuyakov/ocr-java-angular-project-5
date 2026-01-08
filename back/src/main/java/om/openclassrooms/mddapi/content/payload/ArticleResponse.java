package om.openclassrooms.mddapi.content.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import om.openclassrooms.mddapi.content.model.Article;

import java.time.LocalDateTime;

public record   ArticleResponse(
        Long id,
        String title,
        String content,
        String author,
        Long topicId,

        String topic,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd")
        LocalDateTime createdAt,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd")
        LocalDateTime updatedAt
) {
    public static ArticleResponse from(Article article) {
        return new ArticleResponse(article.getId(), article.getTitle(), article.getContent(),
                article.getAuthor().getUsername(),
                article.getTopic().getId(),
                article.getTopic().getName(),
                article.getCreatedAt(),
                article.getUpdatedAt());
    }
}
