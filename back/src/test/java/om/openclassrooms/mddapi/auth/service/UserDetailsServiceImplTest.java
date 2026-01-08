package om.openclassrooms.mddapi.auth.service;

import om.openclassrooms.mddapi.auth.exception.UserNotFoundException;
import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
    }

    @Test
    void loadUserByUsername_ByUsername_Success() {
        when(userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));

        UserDetails result = userDetailsService.loadUserByUsername("testuser");

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository).findByEmailIgnoreCaseOrUsernameIgnoreCase("testuser", "testuser");
    }

    @Test
    void loadUserByUsername_ByEmail_Success() {
        when(userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase("test@example.com", "test@example.com"))
                .thenReturn(Optional.of(testUser));

        UserDetails result = userDetailsService.loadUserByUsername("test@example.com");

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository).findByEmailIgnoreCaseOrUsernameIgnoreCase("test@example.com", "test@example.com");
    }

    @Test
    void loadUserByUsername_UserNotFound_ThrowsUserNotFoundException() {
        when(userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase("nonexistent", "nonexistent"))
                .thenReturn(Optional.empty());

        UserNotFoundException exception = assertThrows(UserNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("nonexistent"));

        assertEquals("nonexistent", exception.getLogin());
        verify(userRepository).findByEmailIgnoreCaseOrUsernameIgnoreCase("nonexistent", "nonexistent");
    }

    @Test
    void loadUserByUsername_CaseInsensitive() {
        when(userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase("TESTUSER", "TESTUSER"))
                .thenReturn(Optional.of(testUser));

        UserDetails result = userDetailsService.loadUserByUsername("TESTUSER");

        assertNotNull(result);
        verify(userRepository).findByEmailIgnoreCaseOrUsernameIgnoreCase("TESTUSER", "TESTUSER");
    }
}
