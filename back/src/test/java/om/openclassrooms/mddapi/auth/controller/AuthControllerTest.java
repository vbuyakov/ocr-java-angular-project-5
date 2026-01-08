package om.openclassrooms.mddapi.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import om.openclassrooms.mddapi.auth.payload.LoginRequest;
import om.openclassrooms.mddapi.auth.payload.RegistrationRequest;
import om.openclassrooms.mddapi.auth.service.AuthService;
import om.openclassrooms.mddapi.common.utils.MessageResolver;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@org.springframework.test.context.TestPropertySource(properties = {
        "APP_NAME=MDDApp",
        "spring.security.jwt.secret-key=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b",
        "spring.security.jwt.expiration-time=7200000"
})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private MessageResolver messageResolver;
    
    @MockitoBean
    private om.openclassrooms.mddapi.security.service.JwtService jwtService;
    
    @MockitoBean
    private om.openclassrooms.mddapi.security.jwt.JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void login_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest("testuser", "Password123!");
        String token = "jwt-token";

        when(authService.loginUser(any(LoginRequest.class))).thenReturn(token);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(token));

        verify(authService).loginUser(any(LoginRequest.class));
    }

    @Test
    void register_Success() throws Exception {
        RegistrationRequest registrationRequest = new RegistrationRequest("testuser", "test@example.com", "Password123!");
        String successMessage = "Registration successful";

        when(messageResolver.get("auth.registration.success")).thenReturn(successMessage);
        doNothing().when(authService).registerUser(any(RegistrationRequest.class));

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value(successMessage));

        verify(authService).registerUser(any(RegistrationRequest.class));
        verify(messageResolver).get("auth.registration.success");
    }

    @Test
    void login_InvalidRequest_ReturnsBadRequest() throws Exception {
        LoginRequest invalidRequest = new LoginRequest("", "");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).loginUser(any(LoginRequest.class));
    }

    @Test
    void register_InvalidRequest_ReturnsBadRequest() throws Exception {
        RegistrationRequest invalidRequest = new RegistrationRequest("", "", "");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).registerUser(any(RegistrationRequest.class));
    }
}
