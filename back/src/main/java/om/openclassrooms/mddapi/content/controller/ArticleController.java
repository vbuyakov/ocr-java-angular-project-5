package om.openclassrooms.mddapi.content.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import om.openclassrooms.mddapi.content.model.Article;
import om.openclassrooms.mddapi.content.payload.ArticleResponse;
import om.openclassrooms.mddapi.content.payload.CommentResponse;
import om.openclassrooms.mddapi.content.payload.CreateArticleRequest;
import om.openclassrooms.mddapi.content.payload.CreateCommentRequest;
import om.openclassrooms.mddapi.content.service.ArticleService;
import om.openclassrooms.mddapi.content.service.CommentService;
import om.openclassrooms.mddapi.user.model.User;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles")
public class ArticleController {

    private final ArticleService articleService;
    private final CommentService commentService;

    public ArticleController(ArticleService articleService, CommentService commentService) {
        this.articleService = articleService;
        this.commentService = commentService;
    }

    @GetMapping
    public List<ArticleResponse> getAllArticles(Sort sort){
        return articleService.getAllArticles(sort);
    }

    @GetMapping("{articleId}")
    public ArticleResponse getArticleById(@PathVariable Long articleId){
        return articleService.getArticleById(articleId);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createArticle(@Valid @RequestBody  CreateArticleRequest request, @AuthenticationPrincipal User user){
        articleService.createArticle(request, user.getId());
    }

    @PostMapping("/{articleId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public void createCommentForArticle(@Valid @RequestBody CreateCommentRequest request, @PathVariable Long articleId, @AuthenticationPrincipal User user){
        commentService.createCommentForArticle(articleId, request.comment(), user.getId());
    }

    @GetMapping("/{articleId}/comments")
    public List<CommentResponse> getCommentsForArticle(@PathVariable Long articleId) {
        return commentService.getAllCommentsForArticle(articleId);
    }


}
