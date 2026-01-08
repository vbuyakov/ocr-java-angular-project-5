package om.openclassrooms.mddapi.content.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import om.openclassrooms.mddapi.auth.payload.LoginRequest;
import om.openclassrooms.mddapi.auth.payload.LoginResponse;
import om.openclassrooms.mddapi.auth.payload.RegistrationRequest;
import om.openclassrooms.mddapi.content.model.Article;
import om.openclassrooms.mddapi.content.model.Topic;
import om.openclassrooms.mddapi.content.payload.ArticleResponse;
import om.openclassrooms.mddapi.content.payload.CommentResponse;
import om.openclassrooms.mddapi.content.payload.CreateArticleRequest;
import om.openclassrooms.mddapi.content.payload.CreateCommentRequest;
import om.openclassrooms.mddapi.content.repository.ArticleRepository;
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
class ArticleControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    private String authToken;
    private User testUser;
    private Topic testTopic;

    @BeforeEach
    void setUp() throws Exception {
        // Configure ObjectMapper to handle custom date formats:
        // ArticleResponse: yyyy/MM/dd, CommentResponse: yyyy/MM/dd HH:mm
        SimpleModule module = new SimpleModule();
        module.addDeserializer(LocalDateTime.class, new com.fasterxml.jackson.databind.JsonDeserializer<LocalDateTime>() {
            @Override
            public LocalDateTime deserialize(com.fasterxml.jackson.core.JsonParser p, com.fasterxml.jackson.databind.DeserializationContext ctxt) throws java.io.IOException {
                String dateStr = p.getText();
                try {
                    // Try parsing with time (HH:mm) - for CommentResponse
                    return LocalDateTime.parse(dateStr, DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"));
                } catch (Exception e1) {
                    try {
                        // Try parsing with time (HH:mm:ss) - fallback
                        return LocalDateTime.parse(dateStr, DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"));
                    } catch (Exception e2) {
                        // If that fails, parse as date only and set time to midnight - for ArticleResponse
                        return LocalDateTime.parse(dateStr + " 00:00:00", DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"));
                    }
                }
            }
        });
        objectMapper.registerModule(module);
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        // Clean up
        articleRepository.deleteAll();
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

        // Create test topic
        testTopic = new Topic();
        testTopic.setName("Java");
        testTopic.setDescription("Java programming");
        topicRepository.save(testTopic);
    }

    @Test
    void getAllArticles_ShouldReturnAllArticles() throws Exception {
        // Arrange - Create articles
        Article article1 = new Article();
        article1.setTitle("Article 1");
        article1.setContent("Content 1");
        article1.setTopic(testTopic);
        article1.setAuthor(testUser);
        articleRepository.save(article1);

        Article article2 = new Article();
        article2.setTitle("Article 2");
        article2.setContent("Content 2");
        article2.setTopic(testTopic);
        article2.setAuthor(testUser);
        articleRepository.save(article2);

        // Act & Assert
        String response = mockMvc.perform(get("/articles")
                        .header("Authorization", "Bearer " + authToken)
                        .param("sort", "title,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<ArticleResponse> articles = objectMapper.readValue(
                response,
                objectMapper.getTypeFactory().constructCollectionType(List.class, ArticleResponse.class)
        );

        assertThat(articles).hasSize(2);
        assertThat(articles).extracting(ArticleResponse::title)
                .containsExactly("Article 1", "Article 2");
    }

    @Test
    void getAllArticles_Empty_ShouldReturnEmptyList() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/articles")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getArticleById_ShouldReturnArticle() throws Exception {
        // Arrange
        Article article = new Article();
        article.setTitle("Test Article");
        article.setContent("Test Content");
        article.setTopic(testTopic);
        article.setAuthor(testUser);
        articleRepository.save(article);

        // Act & Assert
        mockMvc.perform(get("/articles/{id}", article.getId())
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(article.getId()))
                .andExpect(jsonPath("$.title").value("Test Article"))
                .andExpect(jsonPath("$.content").value("Test Content"));
    }

    @Test
    void getArticleById_NotFound_ShouldReturnNotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/articles/{id}", 999L)
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void createArticle_Success_ShouldCreateArticle() throws Exception {
        // Arrange
        CreateArticleRequest request = new CreateArticleRequest(
                "New Article",
                "Article content here",
                testTopic.getId()
        );

        // Act
        mockMvc.perform(post("/articles")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Assert
        List<Article> articles = articleRepository.findAll();
        assertThat(articles).hasSize(1);
        assertThat(articles.get(0).getTitle()).isEqualTo("New Article");
        assertThat(articles.get(0).getContent()).isEqualTo("Article content here");
        assertThat(articles.get(0).getAuthor().getId()).isEqualTo(testUser.getId());
        assertThat(articles.get(0).getTopic().getId()).isEqualTo(testTopic.getId());
    }

    @Test
    void createArticle_WithoutAuth_ShouldReturnUnauthorized() throws Exception {
        // Arrange
        CreateArticleRequest request = new CreateArticleRequest(
                "New Article",
                "Article content",
                testTopic.getId()
        );

        // Act & Assert
        mockMvc.perform(post("/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createArticle_InvalidTopic_ShouldReturnBadRequest() throws Exception {
        // Arrange
        CreateArticleRequest request = new CreateArticleRequest(
                "New Article",
                "Article content",
                999L // Non-existent topic
        );

        // Act & Assert
        mockMvc.perform(post("/articles")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createArticle_BlankTitle_ShouldReturnBadRequest() throws Exception {
        // Arrange
        CreateArticleRequest request = new CreateArticleRequest(
                "",
                "Article content",
                testTopic.getId()
        );

        // Act & Assert
        mockMvc.perform(post("/articles")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createCommentForArticle_Success_ShouldCreateComment() throws Exception {
        // Arrange - Create article
        Article article = new Article();
        article.setTitle("Test Article");
        article.setContent("Test Content");
        article.setTopic(testTopic);
        article.setAuthor(testUser);
        articleRepository.save(article);

        CreateCommentRequest request = new CreateCommentRequest("Great article!");

        // Act
        mockMvc.perform(post("/articles/{id}/comments", article.getId())
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Assert
        String response = mockMvc.perform(get("/articles/{id}/comments", article.getId())
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<CommentResponse> commentList = objectMapper.readValue(
                response,
                objectMapper.getTypeFactory().constructCollectionType(List.class, CommentResponse.class)
        );

        assertThat(commentList).hasSize(1);
        assertThat(commentList.get(0).content()).isEqualTo("Great article!");
    }

    @Test
    void createCommentForArticle_WithoutAuth_ShouldReturnUnauthorized() throws Exception {
        // Arrange
        Article article = new Article();
        article.setTitle("Test Article");
        article.setContent("Test Content");
        article.setTopic(testTopic);
        article.setAuthor(testUser);
        articleRepository.save(article);

        CreateCommentRequest request = new CreateCommentRequest("Great article!");

        // Act & Assert
        mockMvc.perform(post("/articles/{id}/comments", article.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createCommentForArticle_ArticleNotFound_ShouldReturnBadRequest() throws Exception {
        // Arrange
        CreateCommentRequest request = new CreateCommentRequest("Great article!");

        // Act & Assert
        mockMvc.perform(post("/articles/{id}/comments", 999L)
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getCommentsForArticle_ShouldReturnComments() throws Exception {
        // Arrange - Create article with comments
        Article article = new Article();
        article.setTitle("Test Article");
        article.setContent("Test Content");
        article.setTopic(testTopic);
        article.setAuthor(testUser);
        articleRepository.save(article);

        // Create comments via API
        CreateCommentRequest comment1 = new CreateCommentRequest("First comment");
        mockMvc.perform(post("/articles/{id}/comments", article.getId())
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(comment1)))
                .andExpect(status().isCreated());

        CreateCommentRequest comment2 = new CreateCommentRequest("Second comment");
        mockMvc.perform(post("/articles/{id}/comments", article.getId())
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(comment2)))
                .andExpect(status().isCreated());

        // Act & Assert
        String response = mockMvc.perform(get("/articles/{id}/comments", article.getId())
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<CommentResponse> comments = objectMapper.readValue(
                response,
                objectMapper.getTypeFactory().constructCollectionType(List.class, CommentResponse.class)
        );

        assertThat(comments).hasSize(2);
        assertThat(comments).extracting(CommentResponse::content)
                .containsExactly("First comment", "Second comment");
    }

    @Test
    void getCommentsForArticle_NoComments_ShouldReturnEmptyList() throws Exception {
        // Arrange
        Article article = new Article();
        article.setTitle("Test Article");
        article.setContent("Test Content");
        article.setTopic(testTopic);
        article.setAuthor(testUser);
        articleRepository.save(article);

        // Act & Assert
        mockMvc.perform(get("/articles/{id}/comments", article.getId())
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
