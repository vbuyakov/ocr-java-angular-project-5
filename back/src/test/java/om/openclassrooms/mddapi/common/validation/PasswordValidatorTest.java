package om.openclassrooms.mddapi.common.validation;

import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordValidatorTest {

    private PasswordValidator passwordValidator;

    @Mock
    private ConstraintValidatorContext constraintValidatorContext;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder constraintViolationBuilder;

    @BeforeEach
    void setUp() {
        passwordValidator = new PasswordValidator();
        ValidPassword validPassword = mock(ValidPassword.class);
        passwordValidator.initialize(validPassword);
    }

    @Test
    void isValid_ValidPassword_ReturnsTrue() {
        String validPassword = "ValidPass123!";

        boolean result = passwordValidator.isValid(validPassword, constraintValidatorContext);

        assertTrue(result);
    }

    @Test
    void isValid_PasswordWithAllRequirements_ReturnsTrue() {
        String password = "Abc123!@#";

        boolean result = passwordValidator.isValid(password, constraintValidatorContext);

        assertTrue(result);
    }

    @Test
    void isValid_TooShort_ReturnsFalse() {
        String shortPassword = "Abc12!";

        boolean result = passwordValidator.isValid(shortPassword, constraintValidatorContext);

        assertFalse(result);
    }

    @Test
    void isValid_NoUppercase_ReturnsFalse() {
        String password = "abc123!@#";

        boolean result = passwordValidator.isValid(password, constraintValidatorContext);

        assertFalse(result);
    }

    @Test
    void isValid_NoLowercase_ReturnsFalse() {
        String password = "ABC123!@#";

        boolean result = passwordValidator.isValid(password, constraintValidatorContext);

        assertFalse(result);
    }

    @Test
    void isValid_NoDigit_ReturnsFalse() {
        String password = "Abcdef!@#";

        boolean result = passwordValidator.isValid(password, constraintValidatorContext);

        assertFalse(result);
    }

    @Test
    void isValid_NoSpecialCharacter_ReturnsFalse() {
        String password = "Abc123456";

        boolean result = passwordValidator.isValid(password, constraintValidatorContext);

        assertFalse(result);
    }

    @Test
    void isValid_Null_ReturnsTrue() {
        boolean result = passwordValidator.isValid(null, constraintValidatorContext);

        assertTrue(result);
    }

    @Test
    void isValid_EmptyString_ReturnsTrue() {
        boolean result = passwordValidator.isValid("", constraintValidatorContext);

        assertTrue(result);
    }

    @Test
    void isValid_Exactly8Characters_ReturnsTrue() {
        String password = "Abc123!@";

        boolean result = passwordValidator.isValid(password, constraintValidatorContext);

        assertTrue(result);
    }
}
