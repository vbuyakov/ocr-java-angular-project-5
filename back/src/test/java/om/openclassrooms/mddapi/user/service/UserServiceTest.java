package om.openclassrooms.mddapi.user.service;

import om.openclassrooms.mddapi.auth.exception.UserNotFoundException;
import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.payload.ProfileResponse;
import om.openclassrooms.mddapi.user.payload.ProfileUpdateRequest;
import om.openclassrooms.mddapi.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void getUserProfile_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        ProfileResponse response = userService.getUserProfile(1L);

        assertNotNull(response);
        verify(userRepository).findById(1L);
    }

    @Test
    void getUserProfile_UserNotFound_ThrowsUserNotFoundException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getUserProfile(1L));
        verify(userRepository).findById(1L);
    }

    @Test
    void updateUserProfile_Success_WithoutPassword() {
        ProfileUpdateRequest updateRequest = new ProfileUpdateRequest("newuser", "newemail@example.com", null);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmailIgnoreCaseAndIdNot("newemail@example.com", 1L)).thenReturn(false);
        when(userRepository.existsByUsernameIgnoreCaseAndIdNot("newuser", 1L)).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ProfileResponse response = userService.updateUserProfile(updateRequest, 1L);

        assertNotNull(response);
        verify(userRepository, times(2)).findById(1L); // Called in updateUserProfile and getUserProfile
        verify(userRepository).existsByEmailIgnoreCaseAndIdNot("newemail@example.com", 1L);
        verify(userRepository).existsByUsernameIgnoreCaseAndIdNot("newuser", 1L);
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void updateUserProfile_Success_WithPassword() {
        ProfileUpdateRequest updateRequest = new ProfileUpdateRequest("newuser", "newemail@example.com", "NewPassword123!");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmailIgnoreCaseAndIdNot("newemail@example.com", 1L)).thenReturn(false);
        when(userRepository.existsByUsernameIgnoreCaseAndIdNot("newuser", 1L)).thenReturn(false);
        when(passwordEncoder.encode("NewPassword123!")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ProfileResponse response = userService.updateUserProfile(updateRequest, 1L);

        assertNotNull(response);
        verify(passwordEncoder).encode("NewPassword123!");
        verify(userRepository, times(2)).findById(1L); // Called in updateUserProfile and getUserProfile
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUserProfile_UserNotFound_ThrowsUserNotFoundException() {
        ProfileUpdateRequest updateRequest = new ProfileUpdateRequest("newuser", "newemail@example.com", null);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.updateUserProfile(updateRequest, 1L));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUserProfile_EmailAlreadyTaken_ThrowsIllegalArgumentException() {
        ProfileUpdateRequest updateRequest = new ProfileUpdateRequest("newuser", "existing@example.com", null);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmailIgnoreCaseAndIdNot("existing@example.com", 1L)).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> userService.updateUserProfile(updateRequest, 1L));

        assertEquals("Email already taken", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUserProfile_UsernameAlreadyTaken_ThrowsIllegalArgumentException() {
        ProfileUpdateRequest updateRequest = new ProfileUpdateRequest("existinguser", "newemail@example.com", null);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmailIgnoreCaseAndIdNot("newemail@example.com", 1L)).thenReturn(false);
        when(userRepository.existsByUsernameIgnoreCaseAndIdNot("existinguser", 1L)).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> userService.updateUserProfile(updateRequest, 1L));

        assertEquals("Username already taken", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUserProfile_TrimsWhitespace() {
        ProfileUpdateRequest updateRequest = new ProfileUpdateRequest("  newuser  ", "  newemail@example.com  ", "  NewPassword123!  ");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmailIgnoreCaseAndIdNot("newemail@example.com", 1L)).thenReturn(false);
        when(userRepository.existsByUsernameIgnoreCaseAndIdNot("newuser", 1L)).thenReturn(false);
        when(passwordEncoder.encode("NewPassword123!")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ProfileResponse response = userService.updateUserProfile(updateRequest, 1L);

        assertNotNull(response);
        verify(userRepository, times(2)).findById(1L); // Called in updateUserProfile and getUserProfile
        verify(userRepository).existsByEmailIgnoreCaseAndIdNot("newemail@example.com", 1L);
        verify(userRepository).existsByUsernameIgnoreCaseAndIdNot("newuser", 1L);
        verify(passwordEncoder).encode("NewPassword123!");
    }

    @Test
    void updateUserProfile_EmptyPassword_DoesNotUpdatePassword() {
        ProfileUpdateRequest updateRequest = new ProfileUpdateRequest("newuser", "newemail@example.com", "");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmailIgnoreCaseAndIdNot("newemail@example.com", 1L)).thenReturn(false);
        when(userRepository.existsByUsernameIgnoreCaseAndIdNot("newuser", 1L)).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ProfileResponse response = userService.updateUserProfile(updateRequest, 1L);

        assertNotNull(response);
        verify(userRepository, times(2)).findById(1L); // Called in updateUserProfile and getUserProfile
        verify(passwordEncoder, never()).encode(anyString());
    }
}
