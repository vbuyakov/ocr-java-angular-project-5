package om.openclassrooms.mddapi.security.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    private String testSecretKey;
    private Long testExpirationTime;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // The secret key from .env is a hex string (64 hex chars = 32 bytes)
        // JwtService uses Decoders.BASE64.decode, so it expects base64
        // Convert hex to bytes, then to base64 for testing
        String hexKey = "3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b";
        byte[] keyBytes = new byte[hexKey.length() / 2];
        for (int i = 0; i < keyBytes.length; i++) {
            int index = i * 2;
            keyBytes[i] = (byte) Integer.parseInt(hexKey.substring(index, index + 2), 16);
        }
        // Encode to base64 as JwtService expects
        testSecretKey = java.util.Base64.getEncoder().encodeToString(keyBytes);
        testExpirationTime = 7200000L; // 2 hours

        ReflectionTestUtils.setField(jwtService, "jwtSecret", testSecretKey);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", testExpirationTime);
    }

    @Test
    void generateToken_Success() {
        Long userId = 1L;

        String token = jwtService.generateToken(userId);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void generateToken_DifferentUsers_GenerateDifferentTokens() {
        String token1 = jwtService.generateToken(1L);
        String token2 = jwtService.generateToken(2L);

        assertNotEquals(token1, token2);
    }

    @Test
    void extractUserId_Success() {
        Long userId = 1L;
        String token = jwtService.generateToken(userId);

        Long extractedUserId = jwtService.extractUserId(token);

        assertEquals(userId, extractedUserId);
    }

    @Test
    void extractUserId_DifferentTokens_ExtractCorrectUserIds() {
        String token1 = jwtService.generateToken(1L);
        String token2 = jwtService.generateToken(2L);

        assertEquals(1L, jwtService.extractUserId(token1));
        assertEquals(2L, jwtService.extractUserId(token2));
    }

    @Test
    void isTokenValid_ValidToken_ReturnsTrue() {
        String token = jwtService.generateToken(1L);

        boolean isValid = jwtService.isTokenValid(token);

        assertTrue(isValid);
    }

    @Test
    void isTokenValid_InvalidToken_ReturnsFalse() {
        String invalidToken = "invalid.token.here";

        boolean isValid = jwtService.isTokenValid(invalidToken);

        assertFalse(isValid);
    }

    @Test
    void isTokenValid_EmptyToken_ReturnsFalse() {
        boolean isValid = jwtService.isTokenValid("");

        assertFalse(isValid);
    }

    @Test
    void isTokenValid_NullToken_ReturnsFalse() {
        boolean isValid = jwtService.isTokenValid(null);

        assertFalse(isValid);
    }

    @Test
    void generateAndExtractToken_Consistency() {
        Long userId = 123L;
        String token = jwtService.generateToken(userId);
        Long extractedUserId = jwtService.extractUserId(token);

        assertEquals(userId, extractedUserId);
        assertTrue(jwtService.isTokenValid(token));
    }
}
