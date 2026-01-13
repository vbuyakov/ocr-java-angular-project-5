package om.openclassrooms.mddapi.content.repository;

import om.openclassrooms.mddapi.content.model.Article;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    @Query("""
    SELECT a 
    FROM Article a
    JOIN a.topic t
    JOIN t.subscribers u
    WHERE u.id = :userId 
    
    """)
    List<Article> findAllByUserSubscription(@Param("userId") Long userId, Sort sort);
}

