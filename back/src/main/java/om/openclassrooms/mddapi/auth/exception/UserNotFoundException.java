package om.openclassrooms.mddapi.auth.exception;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class UserNotFoundException extends UsernameNotFoundException {
    private final String login;
    public UserNotFoundException(String login) {
        super("auth.login.user.notfound");
        this.login = login;
    }

    public UserNotFoundException() {
        super("auth.login.user.notfound_by_id");
        this.login = "";
    }

    public String getLogin() {
        return login;
    }
}
