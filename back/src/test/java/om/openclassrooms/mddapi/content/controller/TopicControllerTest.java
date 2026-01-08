package om.openclassrooms.mddapi.content.controller;

import om.openclassrooms.mddapi.content.payload.TopicResponse;
import om.openclassrooms.mddapi.content.service.TopicService;
import om.openclassrooms.mddapi.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = TopicController.class)
@AutoConfigureMockMvc(addFilters = false)
@org.springframework.test.context.TestPropertySource(properties = {
        "APP_NAME=MDDApp",
        "spring.security.jwt.secret-key=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b",
        "spring.security.jwt.expiration-time=7200000"
})
@org.springframework.context.annotation.Import(om.openclassrooms.mddapi.config.TestWebMvcConfig.class)
class TopicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TopicService topicService;

    @MockitoBean
    private om.openclassrooms.mddapi.common.utils.MessageResolver messageResolver;
    
    @MockitoBean
    private om.openclassrooms.mddapi.security.service.JwtService jwtService;
    
    @MockitoBean
    private om.openclassrooms.mddapi.security.jwt.JwtAuthenticationFilter jwtAuthenticationFilter;

    private User testUser;
    private TopicResponse topicResponse;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        topicResponse = new TopicResponse(1L, "Test Topic", "Test Description", true,
                LocalDateTime.now(), LocalDateTime.now());
    }

    @Test
    void getAllTopicsWithSubscriptionStatus_Success() throws Exception {
        List<TopicResponse> topics = Arrays.asList(topicResponse);
        when(topicService.getAllTopicsWithSubscriptionStatus(1L)).thenReturn(topics);

        mockMvc.perform(get("/topics")
                        .requestAttr("user", testUser))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Test Topic"));

        verify(topicService).getAllTopicsWithSubscriptionStatus(1L);
    }

    @Test
    void getAllTopicsSortedByName_Success() throws Exception {
        when(topicService.getAllTopics(any())).thenReturn(Arrays.asList());

        mockMvc.perform(get("/topics/selector"))
                .andExpect(status().isOk());

        verify(topicService).getAllTopics(any());
    }

    @Test
    void subscribe_Success() throws Exception {
        doNothing().when(topicService).subscribe(any(User.class), anyLong());

        mockMvc.perform(post("/topics/1/subscribe")
                        .with(csrf())
                        .requestAttr("user", testUser))
                .andExpect(status().isNoContent());

        verify(topicService).subscribe(eq(testUser), eq(1L));
    }

    @Test
    void unsubscribe_Success() throws Exception {
        doNothing().when(topicService).unsubscribe(any(User.class), anyLong());

        mockMvc.perform(delete("/topics/1/subscribe")
                        .with(csrf())
                        .requestAttr("user", testUser))
                .andExpect(status().isNoContent());

        verify(topicService).unsubscribe(eq(testUser), eq(1L));
    }

    @Test
    void getSubscribedTopics_Success() throws Exception {
        Set<TopicResponse> topics = new HashSet<>(Arrays.asList(topicResponse));
        when(topicService.getSubscribedToUserTopics(1L)).thenReturn(topics);

        mockMvc.perform(get("/topics/subscribed")
                        .requestAttr("user", testUser))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));

        verify(topicService).getSubscribedToUserTopics(1L);
    }
}
