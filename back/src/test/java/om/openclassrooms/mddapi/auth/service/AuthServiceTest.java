package om.openclassrooms.mddapi.auth.service;

import om.openclassrooms.mddapi.auth.payload.LoginRequest;
import om.openclassrooms.mddapi.auth.payload.RegistrationRequest;
import om.openclassrooms.mddapi.common.exception.ConflictException;
import om.openclassrooms.mddapi.security.service.JwtService;
import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private RegistrationRequest registrationRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");

        registrationRequest = new RegistrationRequest("testuser", "test@example.com", "Password123!");
        loginRequest = new LoginRequest("testuser", "Password123!");
    }

    @Test
    void registerUser_Success() {
        when(userRepository.existsByUsernameIgnoreCase("testuser")).thenReturn(false);
        when(userRepository.existsByEmailIgnoreCase("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        assertDoesNotThrow(() -> authService.registerUser(registrationRequest));

        verify(userRepository).existsByUsernameIgnoreCase("testuser");
        verify(userRepository).existsByEmailIgnoreCase("test@example.com");
        verify(passwordEncoder).encode("Password123!");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_UsernameAlreadyTaken_ThrowsConflictException() {
        when(userRepository.existsByUsernameIgnoreCase("testuser")).thenReturn(true);

        ConflictException exception = assertThrows(ConflictException.class,
                () -> authService.registerUser(registrationRequest));

        assertTrue(exception.getMessageKeys().contains("auth.registration.username.alreadyTaken"));
        verify(userRepository).existsByUsernameIgnoreCase("testuser");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_EmailAlreadyTaken_ThrowsConflictException() {
        when(userRepository.existsByUsernameIgnoreCase("testuser")).thenReturn(false);
        when(userRepository.existsByEmailIgnoreCase("test@example.com")).thenReturn(true);

        ConflictException exception = assertThrows(ConflictException.class,
                () -> authService.registerUser(registrationRequest));

        assertTrue(exception.getMessageKeys().contains("auth.registration.email.alreadyTaken"));
        verify(userRepository).existsByEmailIgnoreCase("test@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_BothUsernameAndEmailTaken_ThrowsConflictException() {
        when(userRepository.existsByUsernameIgnoreCase("testuser")).thenReturn(true);
        when(userRepository.existsByEmailIgnoreCase("test@example.com")).thenReturn(true);

        ConflictException exception = assertThrows(ConflictException.class,
                () -> authService.registerUser(registrationRequest));

        assertTrue(exception.getMessageKeys().contains("auth.registration.username.alreadyTaken"));
        assertTrue(exception.getMessageKeys().contains("auth.registration.email.alreadyTaken"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_TrimsWhitespace() {
        RegistrationRequest requestWithSpaces = new RegistrationRequest("  testuser  ", "  test@example.com  ", "  Password123!  ");
        when(userRepository.existsByUsernameIgnoreCase("testuser")).thenReturn(false);
        when(userRepository.existsByEmailIgnoreCase("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        assertDoesNotThrow(() -> authService.registerUser(requestWithSpaces));

        verify(userRepository).existsByUsernameIgnoreCase("testuser");
        verify(userRepository).existsByEmailIgnoreCase("test@example.com");
        verify(passwordEncoder).encode("Password123!");
    }

    @Test
    void loginUser_Success() {
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(jwtService.generateToken(1L)).thenReturn("jwt-token");

        String token = authService.loginUser(loginRequest);

        assertEquals("jwt-token", token);
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService).generateToken(1L);
    }

    @Test
    void loginUser_TrimsWhitespace() {
        LoginRequest requestWithSpaces = new LoginRequest("  testuser  ", "  Password123!  ");
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(jwtService.generateToken(1L)).thenReturn("jwt-token");

        String token = authService.loginUser(requestWithSpaces);

        assertEquals("jwt-token", token);
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void loginUser_BadCredentials_ThrowsException() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.loginUser(loginRequest));
        verify(jwtService, never()).generateToken(any());
    }
}
