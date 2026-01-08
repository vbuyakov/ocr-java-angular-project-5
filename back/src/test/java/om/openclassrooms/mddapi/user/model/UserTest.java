package om.openclassrooms.mddapi.user.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Collection;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
    }

    @Test
    void getId_ShouldReturnId() {
        // Arrange
        Long expectedId = 1L;
        user.setId(expectedId);

        // Act
        Long actualId = user.getId();

        // Assert
        assertThat(actualId).isEqualTo(expectedId);
    }

    @Test
    void setId_ShouldSetId() {
        // Arrange
        Long expectedId = 1L;

        // Act
        user.setId(expectedId);

        // Assert
        assertThat(user.getId()).isEqualTo(expectedId);
    }

    @Test
    void getUsername_ShouldReturnUsername() {
        // Arrange
        String expectedUsername = "testuser";
        user.setUsername(expectedUsername);

        // Act
        String actualUsername = user.getUsername();

        // Assert
        assertThat(actualUsername).isEqualTo(expectedUsername);
    }

    @Test
    void setUsername_ShouldSetUsername() {
        // Arrange
        String expectedUsername = "testuser";

        // Act
        user.setUsername(expectedUsername);

        // Assert
        assertThat(user.getUsername()).isEqualTo(expectedUsername);
    }

    @Test
    void getEmail_ShouldReturnEmail() {
        // Arrange
        String expectedEmail = "test@example.com";
        user.setEmail(expectedEmail);

        // Act
        String actualEmail = user.getEmail();

        // Assert
        assertThat(actualEmail).isEqualTo(expectedEmail);
    }

    @Test
    void setEmail_ShouldSetEmail() {
        // Arrange
        String expectedEmail = "test@example.com";

        // Act
        user.setEmail(expectedEmail);

        // Assert
        assertThat(user.getEmail()).isEqualTo(expectedEmail);
    }

    @Test
    void getPassword_ShouldReturnPassword() {
        // Arrange
        String expectedPassword = "password123";
        user.setPassword(expectedPassword);

        // Act
        String actualPassword = user.getPassword();

        // Assert
        assertThat(actualPassword).isEqualTo(expectedPassword);
    }

    @Test
    void setPassword_ShouldSetPassword() {
        // Arrange
        String expectedPassword = "password123";

        // Act
        user.setPassword(expectedPassword);

        // Assert
        assertThat(user.getPassword()).isEqualTo(expectedPassword);
    }

    @Test
    void getCreatedAt_ShouldReturnCreatedAt() {
        // Arrange
        LocalDateTime expectedCreatedAt = LocalDateTime.now();
        user.setCreatedAt(expectedCreatedAt);

        // Act
        LocalDateTime actualCreatedAt = user.getCreatedAt();

        // Assert
        assertThat(actualCreatedAt).isEqualTo(expectedCreatedAt);
    }

    @Test
    void setCreatedAt_ShouldSetCreatedAt() {
        // Arrange
        LocalDateTime expectedCreatedAt = LocalDateTime.now();

        // Act
        user.setCreatedAt(expectedCreatedAt);

        // Assert
        assertThat(user.getCreatedAt()).isEqualTo(expectedCreatedAt);
    }

    @Test
    void getUpdatedAt_ShouldReturnUpdatedAt() {
        // Arrange
        LocalDateTime expectedUpdatedAt = LocalDateTime.now();
        user.setUpdatedAt(expectedUpdatedAt);

        // Act
        LocalDateTime actualUpdatedAt = user.getUpdatedAt();

        // Assert
        assertThat(actualUpdatedAt).isEqualTo(expectedUpdatedAt);
    }

    @Test
    void setUpdatedAt_ShouldSetUpdatedAt() {
        // Arrange
        LocalDateTime expectedUpdatedAt = LocalDateTime.now();

        // Act
        user.setUpdatedAt(expectedUpdatedAt);

        // Assert
        assertThat(user.getUpdatedAt()).isEqualTo(expectedUpdatedAt);
    }

    @Test
    void getAuthorities_ShouldReturnEmptyCollection() {
        // Act
        Collection<? extends org.springframework.security.core.GrantedAuthority> authorities = user.getAuthorities();

        // Assert
        assertThat(authorities).isNotNull();
        assertThat(authorities).isEmpty();
    }

    @Test
    void isAccountNonExpired_ShouldReturnTrue() {
        // Act & Assert
        assertTrue(user.isAccountNonExpired());
    }

    @Test
    void isAccountNonLocked_ShouldReturnTrue() {
        // Act & Assert
        assertTrue(user.isAccountNonLocked());
    }

    @Test
    void isCredentialsNonExpired_ShouldReturnTrue() {
        // Act & Assert
        assertTrue(user.isCredentialsNonExpired());
    }

    @Test
    void isEnabled_ShouldReturnTrue() {
        // Act & Assert
        assertTrue(user.isEnabled());
    }
}
