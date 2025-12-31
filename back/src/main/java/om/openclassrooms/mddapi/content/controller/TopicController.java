package om.openclassrooms.mddapi.content.controller;

import om.openclassrooms.mddapi.content.payload.TopicName;
import om.openclassrooms.mddapi.content.payload.TopicRequest;
import om.openclassrooms.mddapi.content.payload.TopicResponse;
import om.openclassrooms.mddapi.content.service.TopicService;
import om.openclassrooms.mddapi.user.model.User;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path ="/topics")
public class TopicController {
private final TopicService topicService;
    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @GetMapping
    public List<TopicResponse> getAllTopicsWithSubscriptionStatus(@AuthenticationPrincipal User user){
        return topicService.getAllTopicsWithSubscriptionStatus(user.getId());
    }

    @GetMapping("/selector")
    public List<TopicName> getAllTopicsSortedByName(){
        return topicService.getAllTopics(Sort.by("name"))
                .stream()
                .map(TopicName::from)
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/subscribe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void subscribe(@PathVariable Long id, @AuthenticationPrincipal User user){
        topicService.subscribe(user, id);

    }

    @DeleteMapping("/{id}/subscribe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unsubscribe(@PathVariable Long id, @AuthenticationPrincipal User user){
        topicService.unsubscribe(user, id);
    }

    @GetMapping("/subscribed")
    public Set<TopicResponse> getSubscribedTopics(@AuthenticationPrincipal User user){
        return topicService.getSubscribedToUserTopics(user.getId());

    }

    // TODO: Remove this method
    @PostMapping
    public void createTopic(@RequestBody TopicRequest topic){ //TODO: Need to remove because don't need in UI
        this.topicService.createTopic(topic);
    }
}
