package om.openclassrooms.mddapi.content.repository;


import om.openclassrooms.mddapi.content.model.Topic;
import om.openclassrooms.mddapi.content.payload.TopicResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    @Query("""
        SELECT DISTINCT new om.openclassrooms.mddapi.content.payload.TopicResponse(
        t.id,
        t.name,
        t.description,
        CASE WHEN ut.id IS NOT NULL then true ELSE false END,
        t.createdAt,
        t.updatedAt
        ) FROM Topic t
        LEFT JOIN t.subscribers ut ON ut.id = :userId  
        ORDER BY t.updatedAt DESC 
        """)
    List<TopicResponse> findAllWithSubscriptionFlag(@Param("userId") Long userId);

}
