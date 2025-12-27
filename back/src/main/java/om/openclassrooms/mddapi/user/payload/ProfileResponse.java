package om.openclassrooms.mddapi.user.payload;

import om.openclassrooms.mddapi.user.model.User;

public record ProfileResponse (
        Long id,
        String username,
        String email
        //subscibed topics
) {
    public static ProfileResponse from(User user) {
        return new ProfileResponse(user.getId(), user.getUsername(), user.getEmail());
    }

}
