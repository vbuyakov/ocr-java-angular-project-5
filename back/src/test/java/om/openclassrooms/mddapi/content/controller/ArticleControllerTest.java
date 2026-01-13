package om.openclassrooms.mddapi.content.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import om.openclassrooms.mddapi.content.payload.ArticleResponse;
import om.openclassrooms.mddapi.content.payload.CommentResponse;
import om.openclassrooms.mddapi.content.payload.CreateArticleRequest;
import om.openclassrooms.mddapi.content.payload.CreateCommentRequest;
import om.openclassrooms.mddapi.content.service.ArticleService;
import om.openclassrooms.mddapi.content.service.CommentService;
import om.openclassrooms.mddapi.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ArticleController.class)
@AutoConfigureMockMvc(addFilters = false)
@org.springframework.test.context.TestPropertySource(properties = {
        "APP_NAME=MDDApp",
        "spring.security.jwt.secret-key=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b",
        "spring.security.jwt.expiration-time=7200000"
})
@org.springframework.context.annotation.Import(om.openclassrooms.mddapi.config.TestWebMvcConfig.class)
class ArticleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ArticleService articleService;

    @MockitoBean
    private CommentService commentService;

    @MockitoBean
    private om.openclassrooms.mddapi.common.utils.MessageResolver messageResolver;
    
    @MockitoBean
    private om.openclassrooms.mddapi.security.service.JwtService jwtService;
    
    @MockitoBean
    private om.openclassrooms.mddapi.security.jwt.JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private ArticleResponse articleResponse;
    private CommentResponse commentResponse;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        articleResponse = new ArticleResponse(1L, "Test Article", "Test Content", "testuser", 1L,
                "Test Topic", LocalDateTime.now(), LocalDateTime.now());

        commentResponse = new CommentResponse(1L, "Test Comment", "testuser", 1L, LocalDateTime.now());
    }

    @Test
    void getAllArticles_Success() throws Exception {
        List<ArticleResponse> articles = Arrays.asList(articleResponse);
        when(articleService.getAllArticlesForUser(eq(1L), any(Sort.class))).thenReturn(articles);

        mockMvc.perform(get("/articles")
                        .requestAttr("user", testUser))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("Test Article"));

        verify(articleService).getAllArticlesForUser(eq(1L), any(Sort.class));
    }

    @Test
    void getArticleById_Success() throws Exception {
        when(articleService.getArticleById(1L)).thenReturn(articleResponse);

        mockMvc.perform(get("/articles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Test Article"));

        verify(articleService).getArticleById(1L);
    }

    @Test
    void createArticle_Success() throws Exception {
        CreateArticleRequest request = new CreateArticleRequest("Test Article", "Test Content", 1L);
        doNothing().when(articleService).createArticle(any(CreateArticleRequest.class), anyLong());

        mockMvc.perform(post("/articles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .requestAttr("user", testUser))
                .andExpect(status().isCreated());

        verify(articleService).createArticle(any(CreateArticleRequest.class), eq(1L));
    }

    @Test
    void createArticle_InvalidRequest_ReturnsBadRequest() throws Exception {
        CreateArticleRequest invalidRequest = new CreateArticleRequest("", "", null);

        mockMvc.perform(post("/articles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest))
                        .requestAttr("user", testUser))
                .andExpect(status().isBadRequest());

        verify(articleService, never()).createArticle(any(CreateArticleRequest.class), anyLong());
    }

    @Test
    void createCommentForArticle_Success() throws Exception {
        CreateCommentRequest request = new CreateCommentRequest("Test Comment");
        doNothing().when(commentService).createCommentForArticle(anyLong(), anyString(), anyLong());

        mockMvc.perform(post("/articles/1/comments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .requestAttr("user", testUser))
                .andExpect(status().isCreated());

        verify(commentService).createCommentForArticle(eq(1L), eq("Test Comment"), eq(1L));
    }

    @Test
    void getCommentsForArticle_Success() throws Exception {
        List<CommentResponse> comments = Arrays.asList(commentResponse);
        when(commentService.getAllCommentsForArticle(1L)).thenReturn(comments);

        mockMvc.perform(get("/articles/1/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].content").value("Test Comment"));

        verify(commentService).getAllCommentsForArticle(1L);
    }
}
