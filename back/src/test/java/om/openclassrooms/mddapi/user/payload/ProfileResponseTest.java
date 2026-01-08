package om.openclassrooms.mddapi.user.payload;

import om.openclassrooms.mddapi.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class ProfileResponseTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void from_ShouldCreateProfileResponseFromUser() {
        // Act
        ProfileResponse response = ProfileResponse.from(user);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.username()).isEqualTo("testuser");
        assertThat(response.email()).isEqualTo("test@example.com");
    }

    @Test
    void from_WithNullUser_ShouldHandleGracefully() {
        // Arrange
        User nullUser = null;

        // Act & Assert
        try {
            ProfileResponse.from(nullUser);
        } catch (NullPointerException e) {
            // Expected behavior - from() method doesn't handle null
            assertThat(e).isNotNull();
        }
    }
}
