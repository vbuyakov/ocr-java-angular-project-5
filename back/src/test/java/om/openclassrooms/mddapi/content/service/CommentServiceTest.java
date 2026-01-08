package om.openclassrooms.mddapi.content.service;

import om.openclassrooms.mddapi.common.exception.WrongParametersException;
import om.openclassrooms.mddapi.content.model.Article;
import om.openclassrooms.mddapi.content.model.Comment;
import om.openclassrooms.mddapi.content.payload.CommentResponse;
import om.openclassrooms.mddapi.content.repository.ArticleRepository;
import om.openclassrooms.mddapi.content.repository.CommentRepository;
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
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private ArticleRepository articleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CommentService commentService;

    private User testUser;
    private Article testArticle;
    private Comment testComment;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testArticle = new Article();
        testArticle.setId(1L);
        testArticle.setTitle("Test Article");
        testArticle.setContent("Test Content");

        testComment = new Comment();
        testComment.setId(1L);
        testComment.setContent("Test Comment");
        testComment.setArticle(testArticle);
        testComment.setAuthor(testUser);
    }

    @Test
    void createCommentForArticle_Success() {
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(commentRepository.save(any(Comment.class))).thenReturn(testComment);

        assertDoesNotThrow(() -> commentService.createCommentForArticle(1L, "Test Comment", 1L));

        verify(articleRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void createCommentForArticle_ArticleNotFound_ThrowsWrongParametersException() {
        when(articleRepository.findById(1L)).thenReturn(Optional.empty());

        WrongParametersException exception = assertThrows(WrongParametersException.class,
                () -> commentService.createCommentForArticle(1L, "Test Comment", 1L));

        assertEquals("article", exception.getMessage());
        verify(articleRepository).findById(1L);
        verify(userRepository, never()).findById(anyLong());
        verify(commentRepository, never()).save(any(Comment.class));
    }

    @Test
    void createCommentForArticle_UserNotFound_ThrowsWrongParametersException() {
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        WrongParametersException exception = assertThrows(WrongParametersException.class,
                () -> commentService.createCommentForArticle(1L, "Test Comment", 1L));

        assertEquals("user", exception.getMessage());
        verify(articleRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(commentRepository, never()).save(any(Comment.class));
    }

    @Test
    void getAllCommentsForArticle_Success() {
        List<Comment> comments = Arrays.asList(testComment);
        Sort sort = Sort.by(Sort.Direction.ASC, "createdAt");
        when(commentRepository.findByArticleId(1L, sort)).thenReturn(comments);

        List<CommentResponse> result = commentService.getAllCommentsForArticle(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(commentRepository).findByArticleId(1L, sort);
    }

    @Test
    void getAllCommentsForArticle_EmptyList() {
        Sort sort = Sort.by(Sort.Direction.ASC, "createdAt");
        when(commentRepository.findByArticleId(1L, sort)).thenReturn(List.of());

        List<CommentResponse> result = commentService.getAllCommentsForArticle(1L);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(commentRepository).findByArticleId(1L, sort);
    }
}
