package om.openclassrooms.mddapi.content.payload;

public record TopicName(
        Long id,
        String name
) {
    public static TopicName from(om.openclassrooms.mddapi.content.model.Topic topic) {
        return new TopicName(topic.getId(), topic.getName());
    }
}
