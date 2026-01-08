package om.openclassrooms.mddapi.content.service;

import om.openclassrooms.mddapi.common.exception.ResourceNotFoundException;
import om.openclassrooms.mddapi.content.model.Topic;
import om.openclassrooms.mddapi.content.payload.TopicResponse;
import om.openclassrooms.mddapi.content.repository.TopicRepository;
import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TopicServiceTest {

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TopicService topicService;

    private User testUser;
    private Topic testTopic;
    private TopicResponse testTopicResponse;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setSubscribedTopics(new HashSet<>());

        testTopic = new Topic();
        testTopic.setId(1L);
        testTopic.setName("Test Topic");
        testTopic.setDescription("Test Description");

        testTopicResponse = new TopicResponse(1L, "Test Topic", "Test Description", true,
                LocalDateTime.now(), LocalDateTime.now());
    }

    @Test
    void getAllTopics_Success() {
        List<Topic> topics = Arrays.asList(testTopic);
        Sort sort = Sort.by("name");
        when(topicRepository.findAll(sort)).thenReturn(topics);

        List<Topic> result = topicService.getAllTopics(sort);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(topicRepository).findAll(sort);
    }

    @Test
    void getSubscribedToUserTopics_Success() {
        testUser.getSubscribedTopics().add(testTopic);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        Set<TopicResponse> result = topicService.getSubscribedToUserTopics(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userRepository).findById(1L);
    }

    @Test
    void getSubscribedToUserTopics_UserNotFound_ThrowsResourceNotFoundException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> topicService.getSubscribedToUserTopics(1L));

        assertEquals("user.notFound", exception.getMessage());
        verify(userRepository).findById(1L);
    }

    @Test
    void getSubscribedToUserTopics_EmptySet() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        Set<TopicResponse> result = topicService.getSubscribedToUserTopics(1L);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(userRepository).findById(1L);
    }

    @Test
    void getAllTopicsWithSubscriptionStatus_Success() {
        List<TopicResponse> topics = Arrays.asList(testTopicResponse);
        when(topicRepository.findAllWithSubscriptionFlag(1L)).thenReturn(topics);

        List<TopicResponse> result = topicService.getAllTopicsWithSubscriptionStatus(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(topicRepository).findAllWithSubscriptionFlag(1L);
    }

    @Test
    void subscribe_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(topicRepository.findById(1L)).thenReturn(Optional.of(testTopic));

        assertDoesNotThrow(() -> topicService.subscribe(testUser, 1L));

        assertTrue(testUser.getSubscribedTopics().contains(testTopic));
        verify(userRepository).findById(1L);
        verify(topicRepository).findById(1L);
    }

    @Test
    void subscribe_UserNotFound_ThrowsResourceNotFoundException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> topicService.subscribe(testUser, 1L));

        assertEquals("user.notFound", exception.getMessage());
        verify(userRepository).findById(1L);
        verify(topicRepository, never()).findById(anyLong());
    }

    @Test
    void subscribe_TopicNotFound_ThrowsResourceNotFoundException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(topicRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> topicService.subscribe(testUser, 1L));

        assertEquals("topic.notFound", exception.getMessage());
        verify(userRepository).findById(1L);
        verify(topicRepository).findById(1L);
    }

    @Test
    void unsubscribe_Success() {
        testUser.getSubscribedTopics().add(testTopic);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(topicRepository.findById(1L)).thenReturn(Optional.of(testTopic));

        assertDoesNotThrow(() -> topicService.unsubscribe(testUser, 1L));

        assertFalse(testUser.getSubscribedTopics().contains(testTopic));
        verify(userRepository).findById(1L);
        verify(topicRepository).findById(1L);
    }

    @Test
    void unsubscribe_UserNotFound_ThrowsResourceNotFoundException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> topicService.unsubscribe(testUser, 1L));

        assertEquals("user.notFound", exception.getMessage());
        verify(userRepository).findById(1L);
        verify(topicRepository, never()).findById(anyLong());
    }

    @Test
    void unsubscribe_TopicNotFound_ThrowsResourceNotFoundException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(topicRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> topicService.unsubscribe(testUser, 1L));

        assertEquals("topic.notFound", exception.getMessage());
        verify(userRepository).findById(1L);
        verify(topicRepository).findById(1L);
    }
}
