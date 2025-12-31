package om.openclassrooms.mddapi.common.exception;

public class WrongParametersException extends IllegalArgumentException { //TODO: Add to Handler
    public WrongParametersException(String message) {
        super(message);
    } //Todo: add message key
    public WrongParametersException() {
        super("Wrong parameters"); //Todo: add message key
    }
}
