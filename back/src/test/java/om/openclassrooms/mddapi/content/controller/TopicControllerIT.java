package om.openclassrooms.mddapi.content.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import om.openclassrooms.mddapi.auth.payload.LoginRequest;
import om.openclassrooms.mddapi.auth.payload.LoginResponse;
import om.openclassrooms.mddapi.auth.payload.RegistrationRequest;
import om.openclassrooms.mddapi.content.model.Topic;
import om.openclassrooms.mddapi.content.payload.TopicName;
import om.openclassrooms.mddapi.content.payload.TopicResponse;
import om.openclassrooms.mddapi.content.repository.TopicRepository;
import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

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
class TopicControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    private String authToken;
    private User testUser;
    private Topic topic1;
    private Topic topic2;
    private Topic topic3;

    @BeforeEach
    void setUp() throws Exception {
        // Configure ObjectMapper to handle the custom date format from TopicResponse (yyyy/MM/dd)
        SimpleModule module = new SimpleModule();
        module.addDeserializer(LocalDateTime.class, new com.fasterxml.jackson.databind.JsonDeserializer<LocalDateTime>() {
            @Override
            public LocalDateTime deserialize(com.fasterxml.jackson.core.JsonParser p, com.fasterxml.jackson.databind.DeserializationContext ctxt) throws java.io.IOException {
                String dateStr = p.getText();
                try {
                    // Try parsing with time first
                    return LocalDateTime.parse(dateStr, DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"));
                } catch (Exception e) {
                    // If that fails, parse as date only and set time to midnight
                    return LocalDateTime.parse(dateStr + " 00:00:00", DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"));
                }
            }
        });
        objectMapper.registerModule(module);
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        // Clean up
        topicRepository.deleteAll();
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

        // Create test topics
        topic1 = new Topic();
        topic1.setName("Java");
        topic1.setDescription("Java programming language");
        topicRepository.save(topic1);

        topic2 = new Topic();
        topic2.setName("Spring Boot");
        topic2.setDescription("Spring Boot framework");
        topicRepository.save(topic2);

        topic3 = new Topic();
        topic3.setName("Docker");
        topic3.setDescription("Containerization with Docker");
        topicRepository.save(topic3);
    }

    @Test
    void getAllTopicsWithSubscriptionStatus_ShouldReturnAllTopicsWithSubscriptionStatus() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(get("/topics")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3))
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<TopicResponse> topics = objectMapper.readValue(
                response,
                objectMapper.getTypeFactory().constructCollectionType(List.class, TopicResponse.class)
        );

        assertThat(topics).hasSize(3);
        assertThat(topics).extracting(TopicResponse::name)
                .containsExactlyInAnyOrder("Java", "Spring Boot", "Docker");
        assertThat(topics).extracting(TopicResponse::isUserSubscribed)
                .containsOnly(false);
    }

    @Test
    void getAllTopicsSortedByName_ShouldReturnTopicsSortedByName() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(get("/topics/selector")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3))
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<TopicName> topics = objectMapper.readValue(
                response,
                objectMapper.getTypeFactory().constructCollectionType(List.class, TopicName.class)
        );

        assertThat(topics).hasSize(3);
        assertThat(topics).extracting(TopicName::name)
                .containsExactly("Docker", "Java", "Spring Boot");
    }

    @Test
    void subscribe_ShouldSubscribeUserToTopic() throws Exception {
        // Act
        mockMvc.perform(post("/topics/{id}/subscribe", topic1.getId())
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNoContent());

        // Assert
        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedUser.getSubscribedTopics()).hasSize(1);
        assertThat(updatedUser.getSubscribedTopics()).extracting(Topic::getName)
                .containsExactly("Java");
    }

    @Test
    void subscribe_MultipleTopics_ShouldSubscribeUserToMultipleTopics() throws Exception {
        // Act
        mockMvc.perform(post("/topics/{id}/subscribe", topic1.getId())
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/topics/{id}/subscribe", topic2.getId())
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNoContent());

        // Assert
        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedUser.getSubscribedTopics()).hasSize(2);
        assertThat(updatedUser.getSubscribedTopics()).extracting(Topic::getName)
                .containsExactlyInAnyOrder("Java", "Spring Boot");
    }

    @Test
    void subscribe_NonExistentTopic_ShouldReturnNotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/topics/{id}/subscribe", 999L)
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void unsubscribe_ShouldUnsubscribeUserFromTopic() throws Exception {
        // Arrange - Subscribe first
        testUser.getSubscribedTopics().add(topic1);
        testUser.getSubscribedTopics().add(topic2);
        userRepository.save(testUser);

        // Act
        mockMvc.perform(delete("/topics/{id}/subscribe", topic1.getId())
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNoContent());

        // Assert
        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedUser.getSubscribedTopics()).hasSize(1);
        assertThat(updatedUser.getSubscribedTopics()).extracting(Topic::getName)
                .containsExactly("Spring Boot");
    }

    @Test
    void unsubscribe_NonExistentTopic_ShouldReturnNotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/topics/{id}/subscribe", 999L)
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void getSubscribedTopics_ShouldReturnOnlySubscribedTopics() throws Exception {
        // Arrange - Subscribe to topics
        testUser.getSubscribedTopics().add(topic1);
        testUser.getSubscribedTopics().add(topic3);
        userRepository.save(testUser);

        // Act & Assert
        String response = mockMvc.perform(get("/topics/subscribed")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<TopicResponse> topics = objectMapper.readValue(
                response,
                objectMapper.getTypeFactory().constructCollectionType(List.class, TopicResponse.class)
        );

        assertThat(topics).hasSize(2);
        assertThat(topics).extracting(TopicResponse::name)
                .containsExactlyInAnyOrder("Java", "Docker");
        assertThat(topics).extracting(TopicResponse::isUserSubscribed)
                .containsOnly(true);
    }

    @Test
    void getSubscribedTopics_NoSubscriptions_ShouldReturnEmptyList() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(get("/topics/subscribed")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<TopicResponse> topics = objectMapper.readValue(
                response,
                objectMapper.getTypeFactory().constructCollectionType(List.class, TopicResponse.class)
        );

        assertThat(topics).isEmpty();
    }

    @Test
    void getAllTopicsWithSubscriptionStatus_AfterSubscription_ShouldShowSubscriptionStatus() throws Exception {
        // Arrange - Subscribe to topic1
        testUser.getSubscribedTopics().add(topic1);
        userRepository.save(testUser);

        // Act & Assert
        String response = mockMvc.perform(get("/topics")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<TopicResponse> topics = objectMapper.readValue(
                response,
                objectMapper.getTypeFactory().constructCollectionType(List.class, TopicResponse.class)
        );

        assertThat(topics).hasSize(3);
        TopicResponse subscribedTopic = topics.stream()
                .filter(t -> t.name().equals("Java"))
                .findFirst()
                .orElseThrow();
        assertThat(subscribedTopic.isUserSubscribed()).isTrue();

        TopicResponse unsubscribedTopic = topics.stream()
                .filter(t -> t.name().equals("Spring Boot"))
                .findFirst()
                .orElseThrow();
        assertThat(unsubscribedTopic.isUserSubscribed()).isFalse();
    }

    @Test
    void getAllTopics_WithoutAuth_ShouldReturnUnauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/topics"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void subscribe_WithoutAuth_ShouldReturnUnauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/topics/{id}/subscribe", topic1.getId()))
                .andExpect(status().isUnauthorized());
    }
}
