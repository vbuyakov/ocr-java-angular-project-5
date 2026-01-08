package om.openclassrooms.mddapi.common.exception;

public class WrongParametersException extends IllegalArgumentException {
    public WrongParametersException(String message) {
        super(message);
    }
    public WrongParametersException() {
        super("wrong.parameters.message");
    }
}
