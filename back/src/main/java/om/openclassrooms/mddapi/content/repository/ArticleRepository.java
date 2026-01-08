package om.openclassrooms.mddapi.content.repository;

import om.openclassrooms.mddapi.content.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {}

