package om.openclassrooms.mddapi.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.payload.ProfileResponse;
import om.openclassrooms.mddapi.user.payload.ProfileUpdateRequest;
import om.openclassrooms.mddapi.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
@org.springframework.test.context.TestPropertySource(properties = {
        "APP_NAME=MDDApp",
        "spring.security.jwt.secret-key=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b",
        "spring.security.jwt.expiration-time=7200000"
})
@org.springframework.context.annotation.Import(om.openclassrooms.mddapi.config.TestWebMvcConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private om.openclassrooms.mddapi.common.utils.MessageResolver messageResolver;
    
    @MockitoBean
    private om.openclassrooms.mddapi.security.service.JwtService jwtService;
    
    @MockitoBean
    private om.openclassrooms.mddapi.security.jwt.JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private ProfileResponse profileResponse;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        profileResponse = new ProfileResponse(1L, "testuser", "test@example.com");
    }

    @Test
    void getProfile_Success() throws Exception {
        when(userService.getUserProfile(1L)).thenReturn(profileResponse);

        mockMvc.perform(get("/user/profile")
                        .requestAttr("user", testUser))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).getUserProfile(1L);
    }

    @Test
    void updateProfile_Success() throws Exception {
        ProfileUpdateRequest updateRequest = new ProfileUpdateRequest("newuser", "newemail@example.com", null);
        ProfileResponse updatedResponse = new ProfileResponse(1L, "newuser", "newemail@example.com");

        when(userService.updateUserProfile(any(ProfileUpdateRequest.class), eq(1L))).thenReturn(updatedResponse);

        mockMvc.perform(put("/user/profile")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest))
                        .requestAttr("user", testUser))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newuser"))
                .andExpect(jsonPath("$.email").value("newemail@example.com"));

        verify(userService).updateUserProfile(any(ProfileUpdateRequest.class), eq(1L));
    }

    @Test
    void updateProfile_InvalidRequest_ReturnsBadRequest() throws Exception {
        ProfileUpdateRequest invalidRequest = new ProfileUpdateRequest("", "", null);

        mockMvc.perform(put("/user/profile")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest))
                        .requestAttr("user", testUser))
                .andExpect(status().isBadRequest());

        verify(userService, never()).updateUserProfile(any(ProfileUpdateRequest.class), anyLong());
    }
}
