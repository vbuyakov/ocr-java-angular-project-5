package om.openclassrooms.mddapi.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import om.openclassrooms.mddapi.security.service.JwtService;
import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class JwtAuthenticationFilterTest {

    private JwtService jwtService;
    private UserRepository userRepository;
    private JwtAuthenticationFilter filter;
    private HttpServletRequest request;
    private HttpServletResponse response;
    private FilterChain filterChain;
    private User testUser;

    @BeforeEach
    void setUp() {
        jwtService = mock(JwtService.class);
        userRepository = mock(UserRepository.class);
        filter = new JwtAuthenticationFilter(jwtService, userRepository);
        request = mock(HttpServletRequest.class);
        response = mock(HttpServletResponse.class);
        filterChain = mock(FilterChain.class);
        SecurityContextHolder.clearContext();

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
    }

    @Test
    void doFilterInternal_NoAuthorizationHeader_ShouldPassThrough() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(jwtService, never()).isTokenValid(anyString());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_AuthorizationHeaderWithoutBearer_ShouldPassThrough() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("InvalidToken");

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(jwtService, never()).isTokenValid(anyString());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_InvalidToken_ShouldPassThrough() throws Exception {
        String token = "valid.jwt.token";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.isTokenValid(token)).thenReturn(false);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(jwtService).isTokenValid(token);
        verify(userRepository, never()).findById(anyLong());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_ValidToken_UserFound_ShouldAuthenticate() throws Exception {
        String token = "valid.jwt.token";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.isTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserId(token)).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
        verify(userRepository).findById(1L);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(testUser, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }

    @Test
    void doFilterInternal_ValidToken_UserNotFound_ShouldPassThrough() throws Exception {
        String token = "valid.jwt.token";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.isTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserId(token)).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
        verify(userRepository).findById(1L);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_ExpiredToken_ShouldThrowCredentialsExpiredException() throws Exception {
        String token = "expired.jwt.token";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.isTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserId(token)).thenThrow(new io.jsonwebtoken.ExpiredJwtException(null, null, "Token expired"));

        assertThrows(org.springframework.security.authentication.CredentialsExpiredException.class, () -> {
            filter.doFilterInternal(request, response, filterChain);
        });

        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
        verify(userRepository, never()).findById(anyLong());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_InvalidJwtFormat_ShouldThrowBadCredentialsException() throws Exception {
        String token = "invalid.jwt.token";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.isTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserId(token)).thenThrow(new io.jsonwebtoken.JwtException("Invalid JWT"));

        assertThrows(org.springframework.security.authentication.BadCredentialsException.class, () -> {
            filter.doFilterInternal(request, response, filterChain);
        });

        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
        verify(userRepository, never()).findById(anyLong());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_IllegalArgumentException_ShouldThrowBadCredentialsException() throws Exception {
        String token = "invalid.jwt.token";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.isTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserId(token)).thenThrow(new IllegalArgumentException("Invalid argument"));

        assertThrows(org.springframework.security.authentication.BadCredentialsException.class, () -> {
            filter.doFilterInternal(request, response, filterChain);
        });

        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
        verify(userRepository, never()).findById(anyLong());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_AlreadyAuthenticated_ShouldNotReAuthenticate() throws Exception {
        String token = "valid.jwt.token";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.isTokenValid(token)).thenReturn(true);
        
        // Set up already authenticated context
        org.springframework.security.core.Authentication existingAuth = 
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                testUser, null, testUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(existingAuth);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(jwtService).isTokenValid(token);
        verify(jwtService, never()).extractUserId(anyString());
        verify(userRepository, never()).findById(anyLong());
        // Should keep existing authentication
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(existingAuth, SecurityContextHolder.getContext().getAuthentication());
    }
}
