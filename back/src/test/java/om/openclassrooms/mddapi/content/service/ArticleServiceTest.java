package om.openclassrooms.mddapi.content.service;

import om.openclassrooms.mddapi.common.exception.ResourceNotFoundException;
import om.openclassrooms.mddapi.common.exception.WrongParametersException;
import om.openclassrooms.mddapi.content.model.Article;
import om.openclassrooms.mddapi.content.model.Topic;
import om.openclassrooms.mddapi.content.payload.ArticleResponse;
import om.openclassrooms.mddapi.content.payload.CreateArticleRequest;
import om.openclassrooms.mddapi.content.repository.ArticleRepository;
import om.openclassrooms.mddapi.content.repository.CommentRepository;
import om.openclassrooms.mddapi.content.repository.TopicRepository;
import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

    @Mock
    private ArticleRepository articleRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private ArticleService articleService;

    private User testUser;
    private Topic testTopic;
    private Article testArticle;
    private CreateArticleRequest createRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testTopic = new Topic();
        testTopic.setId(1L);
        testTopic.setName("Test Topic");
        testTopic.setDescription("Test Description");

        testArticle = new Article();
        testArticle.setId(1L);
        testArticle.setTitle("Test Article");
        testArticle.setContent("Test Content");
        testArticle.setAuthor(testUser);
        testArticle.setTopic(testTopic);

        createRequest = new CreateArticleRequest("Test Article", "Test Content", 1L);
    }

    @Test
    void createArticle_Success() {
        when(topicRepository.findById(1L)).thenReturn(Optional.of(testTopic));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(articleRepository.save(any(Article.class))).thenReturn(testArticle);

        assertDoesNotThrow(() -> articleService.createArticle(createRequest, 1L));

        verify(topicRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(articleRepository).save(any(Article.class));
    }

    @Test
    void createArticle_TopicNotFound_ThrowsWrongParametersException() {
        when(topicRepository.findById(1L)).thenReturn(Optional.empty());

        WrongParametersException exception = assertThrows(WrongParametersException.class,
                () -> articleService.createArticle(createRequest, 1L));

        assertEquals("topic", exception.getMessage());
        verify(topicRepository).findById(1L);
        verify(userRepository, never()).findById(anyLong());
        verify(articleRepository, never()).save(any(Article.class));
    }

    @Test
    void createArticle_UserNotFound_ThrowsWrongParametersException() {
        when(topicRepository.findById(1L)).thenReturn(Optional.of(testTopic));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        WrongParametersException exception = assertThrows(WrongParametersException.class,
                () -> articleService.createArticle(createRequest, 1L));

        assertEquals("user", exception.getMessage());
        verify(topicRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(articleRepository, never()).save(any(Article.class));
    }

    @Test
    void getAllArticles_ForUser_Success() {
        List<Article> articles = Arrays.asList(testArticle);
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        when(articleRepository.findAllByUserSubscription(1L, sort)).thenReturn(articles);

        List<ArticleResponse> result = articleService.getAllArticlesForUser(1L, sort);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(articleRepository).findAllByUserSubscription(1L, sort);
    }

    @Test
    void getAllArticles_ForUser_EmptyList() {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        when(articleRepository.findAllByUserSubscription(1L, sort)).thenReturn(List.of());

        List<ArticleResponse> result = articleService.getAllArticlesForUser(1L, sort);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(articleRepository).findAllByUserSubscription(1L, sort);
    }

    @Test
    void getArticleById_Success() {
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));

        ArticleResponse result = articleService.getArticleById(1L);

        assertNotNull(result);
        verify(articleRepository).findById(1L);
    }

    @Test
    void getArticleById_NotFound_ThrowsResourceNotFoundException() {
        when(articleRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> articleService.getArticleById(1L));

        assertEquals("article", exception.getMessage());
        verify(articleRepository).findById(1L);
    }
}
