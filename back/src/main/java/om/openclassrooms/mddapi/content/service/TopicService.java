package om.openclassrooms.mddapi.content.service;


import om.openclassrooms.mddapi.common.exception.ResourceNotFoundException;
import om.openclassrooms.mddapi.content.model.Topic;
import om.openclassrooms.mddapi.content.payload.TopicResponse;
import om.openclassrooms.mddapi.content.repository.TopicRepository;
import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TopicService {
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    public TopicService(TopicRepository topicRepository, UserRepository userRepository) {
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
    }

    public List<Topic> getAllTopics(Sort sort){
        return topicRepository.findAll(sort);
    }

    @Transactional(readOnly = true)
    public Set<TopicResponse> getSubscribedToUserTopics(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("user.notFound"));
        return user.getSubscribedTopics()
                .stream()
                .map(topic ->
                        new TopicResponse(topic.getId(),
                                topic.getName(),
                                topic.getDescription(),
                                true,
                                topic.getCreatedAt(),
                                topic.getUpdatedAt())
                )
                .collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getAllTopicsWithSubscriptionStatus(Long userId) {
        return topicRepository.findAllWithSubscriptionFlag(userId);
    }

    @Transactional
    public void subscribe(User principalUser, Long topicId){
        User user = userRepository.findById(principalUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("user.notFound"));

        Topic topic = topicRepository.findById(topicId).
                orElseThrow(() -> new ResourceNotFoundException("topic.notFound"));

        user.getSubscribedTopics().add(topic);
    }

    @Transactional
    public void unsubscribe(User principalUser, Long topicId){
        User user = userRepository.findById(principalUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("user.notFound"));

        Topic topic = topicRepository.findById(topicId).
                orElseThrow(() -> new ResourceNotFoundException("topic.notFound"));

        user.getSubscribedTopics().remove(topic);
    }
}