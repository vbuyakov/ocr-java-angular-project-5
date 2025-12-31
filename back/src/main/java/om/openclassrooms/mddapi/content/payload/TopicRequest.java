package om.openclassrooms.mddapi.content.payload;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class TopicRequest {
    private String name;
    private String description;
}
