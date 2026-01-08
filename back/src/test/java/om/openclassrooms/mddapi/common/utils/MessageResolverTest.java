package om.openclassrooms.mddapi.common.utils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageResolverTest {

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private MessageResolver messageResolver;

    @Test
    void get_WithKey_Success() {
        String key = "test.key";
        String expectedMessage = "Test Message";
        when(messageSource.getMessage(eq(key), isNull(), isNull())).thenReturn(expectedMessage);

        String result = messageResolver.get(key);

        assertEquals(expectedMessage, result);
        verify(messageSource).getMessage(eq(key), isNull(), isNull());
    }

    @Test
    void get_WithKeyAndArgs_Success() {
        String key = "test.key";
        Object[] args = {"arg1", "arg2"};
        String expectedMessage = "Test Message with arg1 and arg2";
        when(messageSource.getMessage(eq(key), eq(args), isNull())).thenReturn(expectedMessage);

        String result = messageResolver.get(key, args);

        assertEquals(expectedMessage, result);
        verify(messageSource).getMessage(eq(key), eq(args), isNull());
    }

    @Test
    void get_WithKeyAndSingleArg_Success() {
        String key = "test.key";
        Object arg = "arg1";
        String expectedMessage = "Test Message with arg1";
        when(messageSource.getMessage(eq(key), any(), isNull())).thenReturn(expectedMessage);

        String result = messageResolver.get(key, arg);

        assertEquals(expectedMessage, result);
        verify(messageSource).getMessage(eq(key), any(), isNull());
    }
}
