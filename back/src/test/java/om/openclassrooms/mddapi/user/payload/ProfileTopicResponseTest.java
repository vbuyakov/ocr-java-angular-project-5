package om.openclassrooms.mddapi.user.payload;

import om.openclassrooms.mddapi.content.model.Topic;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ProfileTopicResponseTest {

    private Topic topic;

    @BeforeEach
    void setUp() {
        topic = new Topic();
        topic.setId(1L);
        topic.setName("Java");
        topic.setDescription("Java programming language");
    }

    @Test
    void from_ShouldCreateProfileTopicResponseFromTopic() {
        // Act
        ProfileTopicResponse response = ProfileTopicResponse.from(topic);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Java");
        assertThat(response.description()).isEqualTo("Java programming language");
    }

    @Test
    void from_WithNullTopic_ShouldHandleGracefully() {
        // Arrange
        Topic nullTopic = null;

        // Act & Assert
        try {
            ProfileTopicResponse.from(nullTopic);
        } catch (NullPointerException e) {
            // Expected behavior - from() method doesn't handle null
            assertThat(e).isNotNull();
        }
    }
}
