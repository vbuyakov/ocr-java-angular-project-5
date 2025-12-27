package om.openclassrooms.mddapi.content.controller;

import om.openclassrooms.mddapi.content.payload.TopicRequest;
import om.openclassrooms.mddapi.content.payload.TopicResponse;
import om.openclassrooms.mddapi.content.service.TopicService;
import om.openclassrooms.mddapi.user.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path ="/topics")
public class TopicController {
private final TopicService topicService;
    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @GetMapping
    public List<TopicResponse> getAllTopics(@AuthenticationPrincipal User user){
        return this.topicService.getAllTopics(user.getId());
    }

    @PostMapping("/{id}/subscribe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void subscribe(@PathVariable Long id, @AuthenticationPrincipal User user){
        this.topicService.subscribe(user, id);

    }

    @DeleteMapping("/{id}/subscribe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unsubscribe(@PathVariable Long id, @AuthenticationPrincipal User user){
        this.topicService.unsubscribe(user, id);
    }

    @PostMapping
    public void createTopic(@RequestBody TopicRequest topic){ //TODO: Need to remove because don't need in UI
        this.topicService.createTopic(topic);
    }

}
