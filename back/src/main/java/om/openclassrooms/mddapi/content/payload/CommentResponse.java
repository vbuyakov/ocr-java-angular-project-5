package om.openclassrooms.mddapi.content.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import om.openclassrooms.mddapi.content.model.Comment;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        String content,
        String author,

        Long articleId,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd HH:mm")
        LocalDateTime createdAt
) {
    public static CommentResponse from(Comment comment) {
        return new CommentResponse(comment.getId(),
                comment.getContent(),
                comment.getAuthor().getUsername(),
                comment.getArticle().getId(),
                comment.getCreatedAt());
    }
}
