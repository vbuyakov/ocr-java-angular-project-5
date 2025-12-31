package om.openclassrooms.mddapi.content.service;

import om.openclassrooms.mddapi.common.exception.WrongParametersException;
import om.openclassrooms.mddapi.content.model.Article;
import om.openclassrooms.mddapi.content.model.Comment;
import om.openclassrooms.mddapi.content.payload.CommentResponse;
import om.openclassrooms.mddapi.content.repository.ArticleRepository;
import om.openclassrooms.mddapi.content.repository.CommentRepository;
import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;


    public CommentService(CommentRepository commentRepository, ArticleRepository articleRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void createCommentForArticle(Long articleId, String content, Long userId){
        Article article = articleRepository.findById(articleId)
                .orElseThrow(()->new WrongParametersException("article"));
        User user = userRepository.findById(userId)
                .orElseThrow(()->new WrongParametersException("user"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setArticle(article);
        comment.setAuthor(user);
        commentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getAllCommentsForArticle(Long articleId) {
        return commentRepository.findByArticleId(articleId, Sort.by(Sort.Direction.ASC, "createdAt"))
                .stream()
                .map(CommentResponse::from)
                .collect(Collectors.toList());
    }
}
