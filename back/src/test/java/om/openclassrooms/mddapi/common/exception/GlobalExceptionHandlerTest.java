package om.openclassrooms.mddapi.common.exception;

import om.openclassrooms.mddapi.auth.exception.UserNotFoundException;
import om.openclassrooms.mddapi.common.payload.MessageResponse;
import om.openclassrooms.mddapi.common.utils.MessageResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    @Mock
    private MessageResolver messageResolver;

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @BeforeEach
    void setUp() {
        // Setup will be done per test as needed
    }

    @Test
    void handleValidation_Success() {
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError1 = new FieldError("object", "field1", "error1");
        FieldError fieldError2 = new FieldError("object", "field2", "error2");

        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(Arrays.asList(fieldError1, fieldError2));

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleValidation(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("error1", response.getBody().get("field1"));
        assertEquals("error2", response.getBody().get("field2"));
    }

    @Test
    void handleWrongParameters_Success() {
        WrongParametersException ex = new WrongParametersException("test.message");

        ResponseEntity<MessageResponse> response = globalExceptionHandler.handleWrongParameters(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("test.message", response.getBody().message());
    }

    @Test
    void handleConflict_Success() {
        List<String> messageKeys = Arrays.asList("error.key1", "error.key2");
        ConflictException ex = new ConflictException(messageKeys);
        when(messageResolver.get("error.key1")).thenReturn("Error 1");
        when(messageResolver.get("error.key2")).thenReturn("Error 2");

        ResponseEntity<Map<String, List<String>>> response = globalExceptionHandler.handleConflict(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("errors"));
        verify(messageResolver, times(2)).get(anyString());
    }

    @Test
    void handleUserNotFound_Success() {
        UserNotFoundException ex = new UserNotFoundException("testuser");
        when(messageResolver.get(anyString(), any())).thenReturn("User not found: testuser");

        ResponseEntity<MessageResponse> response = globalExceptionHandler.handleUserNotFound(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(messageResolver).get(anyString(), any());
    }

    @Test
    void handleBadCredentials_Success() {
        BadCredentialsException ex = new BadCredentialsException("Bad credentials");
        when(messageResolver.get("auth.login.badCredentials")).thenReturn("Bad credentials");

        ResponseEntity<MessageResponse> response = globalExceptionHandler.handleBadCredentials(ex);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(messageResolver).get("auth.login.badCredentials");
    }

    @Test
    void handleWrongRequest_Success() {
        HttpMessageNotReadableException ex = mock(HttpMessageNotReadableException.class);

        ResponseEntity<MessageResponse> response = globalExceptionHandler.handleWrongRequest(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Wrong request", response.getBody().message());
    }

    @Test
    void handleMediaType_Success() {
        HttpMediaTypeNotSupportedException ex = new HttpMediaTypeNotSupportedException("Unsupported media type");

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleMediaType(ex);

        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("unsupported_media_type", response.getBody().get("error"));
    }

    @Test
    void handleNotFound_Success() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Resource not found");

        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handleNotFound(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("not_found", response.getBody().get("error"));
        assertEquals("Resource not found", response.getBody().get("message"));
    }

    @Test
    void handleUnexpected_Success() {
        Exception ex = new RuntimeException("Unexpected error");

        ResponseEntity<Map<String, Object>> response = globalExceptionHandler.handleUnexpected(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("internal_error", response.getBody().get("error"));
        assertEquals("Une erreur interne est survenue", response.getBody().get("message"));
    }
}
