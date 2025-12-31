package om.openclassrooms.mddapi.user.payload;

public record ProfileTopicResponse (
        Long id,
        String name,
        String description
){
    public static ProfileTopicResponse from(om.openclassrooms.mddapi.content.model.Topic topic) {
        return new ProfileTopicResponse(topic.getId(), topic.getName(), topic.getDescription());
    }
}
