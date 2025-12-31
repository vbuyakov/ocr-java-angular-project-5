package om.openclassrooms.mddapi.content.service;

import om.openclassrooms.mddapi.common.exception.WrongParametersException;
import om.openclassrooms.mddapi.content.model.Article;
import om.openclassrooms.mddapi.content.payload.ArticleResponse;
import om.openclassrooms.mddapi.content.payload.CreateArticleRequest;
import om.openclassrooms.mddapi.content.repository.ArticleRepository;
import om.openclassrooms.mddapi.content.repository.CommentRepository;
import om.openclassrooms.mddapi.content.repository.TopicRepository;
import om.openclassrooms.mddapi.user.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final CommentRepository commentRepository;

    public ArticleService(ArticleRepository articleRepository,
                          UserRepository userRepository,
                          TopicRepository topicRepository,
                          CommentRepository commentRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.commentRepository = commentRepository;
    }

    public void createArticle(CreateArticleRequest createArticleRequest, Long userId)
    {
        Article article = new Article();
        article.setTitle(createArticleRequest.title());
        article.setContent(createArticleRequest.content());
        article.setTopic(topicRepository.findById(createArticleRequest.topicId()).orElseThrow(
                () -> new WrongParametersException("topic")));
        article.setAuthor(userRepository.findById(userId).orElseThrow(
                () -> new WrongParametersException("user")));
        articleRepository.save(article);
    }

    @Transactional(readOnly = true)
    public List<ArticleResponse> getAllArticles(Sort sort) {
        return articleRepository.findAll(sort)
                .stream()
                .map(ArticleResponse::from)
                .collect(Collectors.toList());
    }

    public ArticleResponse getArticleById(Long articleId) {
        return ArticleResponse.from(articleRepository.findById(articleId).orElseThrow(
                () -> new WrongParametersException("article")));
    }
}
