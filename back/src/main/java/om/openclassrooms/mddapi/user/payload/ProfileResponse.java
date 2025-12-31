package om.openclassrooms.mddapi.user.payload;

import om.openclassrooms.mddapi.content.model.Topic;
import om.openclassrooms.mddapi.user.model.User;

import java.util.List;
import java.util.Set;

public record ProfileResponse (
        Long id,
        String username,
        String email

) {
    public static ProfileResponse from(User user) {
        return new ProfileResponse(user.getId(), user.getUsername(), user.getEmail());
    }
}
