package om.openclassrooms.mddapi.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import om.openclassrooms.mddapi.auth.payload.LoginRequest;
import om.openclassrooms.mddapi.auth.payload.LoginResponse;
import om.openclassrooms.mddapi.auth.payload.RegistrationRequest;
import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.payload.ProfileResponse;
import om.openclassrooms.mddapi.user.payload.ProfileUpdateRequest;
import om.openclassrooms.mddapi.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "APP_NAME=MDDApp",
        "SERVER_PORT=8080",
        "API_PATH=/api",
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.security.jwt.secret-key=dGVzdC1zZWNyZXQta2V5LWZvci1qd3QtdG9rZW4tZ2VuZXJhdGlvbi1hbmQtdmFsaWRhdGlvbg==",
        "spring.security.jwt.expiration-time=7200000"
})
@Transactional
class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String authToken;
    private User testUser;

    @BeforeEach
    void setUp() throws Exception {
        // Clean up
        userRepository.deleteAll();

        // Create test user
        RegistrationRequest registrationRequest = new RegistrationRequest(
                "testuser",
                "test@example.com",
                "Password123!"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isCreated());

        // Login to get token
        LoginRequest loginRequest = new LoginRequest("testuser", "Password123!");
        String response = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        LoginResponse loginResponse = objectMapper.readValue(response, LoginResponse.class);
        authToken = loginResponse.token();

        // Get the created user
        testUser = userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase("test@example.com", "testuser")
                .orElseThrow();
    }

    @Test
    void getProfile_ShouldReturnUserProfile() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(get("/user/profile")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ProfileResponse profile = objectMapper.readValue(response, ProfileResponse.class);
        assertThat(profile.username()).isEqualTo("testuser");
        assertThat(profile.email()).isEqualTo("test@example.com");
        assertThat(profile.id()).isEqualTo(testUser.getId());
    }

    @Test
    void getProfile_WithoutAuth_ShouldReturnUnauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/user/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateProfile_Success_ShouldUpdateProfile() throws Exception {
        // Arrange
        ProfileUpdateRequest request = new ProfileUpdateRequest(
                "updateduser",
                "updated@example.com",
                "NewPassword123!"
        );

        // Act
        String response = mockMvc.perform(put("/user/profile")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ProfileResponse updatedProfile = objectMapper.readValue(response, ProfileResponse.class);
        assertThat(updatedProfile.username()).isEqualTo("updateduser");
        assertThat(updatedProfile.email()).isEqualTo("updated@example.com");

        // Verify in database
        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedUser.getUsername()).isEqualTo("updateduser");
        assertThat(updatedUser.getEmail()).isEqualTo("updated@example.com");
        assertThat(passwordEncoder.matches("NewPassword123!", updatedUser.getPassword())).isTrue();
    }

    @Test
    void updateProfile_WithoutPassword_ShouldUpdateOnlyUsernameAndEmail() throws Exception {
        // Arrange
        ProfileUpdateRequest request = new ProfileUpdateRequest(
                "updateduser",
                "updated@example.com",
                null
        );

        // Act
        String response = mockMvc.perform(put("/user/profile")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ProfileResponse updatedProfile = objectMapper.readValue(response, ProfileResponse.class);
        assertThat(updatedProfile.username()).isEqualTo("updateduser");
        assertThat(updatedProfile.email()).isEqualTo("updated@example.com");

        // Verify password unchanged
        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(passwordEncoder.matches("Password123!", updatedUser.getPassword())).isTrue();
    }

    @Test
    void updateProfile_WithoutAuth_ShouldReturnUnauthorized() throws Exception {
        // Arrange
        ProfileUpdateRequest request = new ProfileUpdateRequest(
                "updateduser",
                "updated@example.com",
                "NewPassword123!"
        );

        // Act & Assert
        mockMvc.perform(put("/user/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateProfile_InvalidEmail_ShouldReturnBadRequest() throws Exception {
        // Arrange
        ProfileUpdateRequest request = new ProfileUpdateRequest(
                "updateduser",
                "invalid-email",
                null
        );

        // Act & Assert
        mockMvc.perform(put("/user/profile")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateProfile_BlankUsername_ShouldReturnBadRequest() throws Exception {
        // Arrange
        ProfileUpdateRequest request = new ProfileUpdateRequest(
                "",
                "updated@example.com",
                null
        );

        // Act & Assert
        mockMvc.perform(put("/user/profile")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateProfile_InvalidPassword_ShouldReturnBadRequest() throws Exception {
        // Arrange
        ProfileUpdateRequest request = new ProfileUpdateRequest(
                "updateduser",
                "updated@example.com",
                "weak"
        );

        // Act & Assert
        mockMvc.perform(put("/user/profile")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
