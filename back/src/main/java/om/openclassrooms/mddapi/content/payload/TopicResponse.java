package om.openclassrooms.mddapi.content.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record TopicResponse (
    Long id,
    String name,
    String description,

    Boolean isUserSubscribed,

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd")
    LocalDateTime createdAt,

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd")
    LocalDateTime updatedAt
){ }
