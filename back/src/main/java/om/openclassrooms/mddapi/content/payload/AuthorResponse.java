package om.openclassrooms.mddapi.content.payload;

import om.openclassrooms.mddapi.user.model.User;

public record AuthorResponse(
        String author
) {
    public static AuthorResponse from(User author) {
        return new AuthorResponse(author.getUsername());
    }
}
