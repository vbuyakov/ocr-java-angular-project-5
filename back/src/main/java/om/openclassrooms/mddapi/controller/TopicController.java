package om.openclassrooms.mddapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path ="/topics")
public class TopicController {

    @GetMapping
    public String getAllTopics(){
        return "All topics";
    }

}
