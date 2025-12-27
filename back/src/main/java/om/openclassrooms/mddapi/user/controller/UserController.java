package om.openclassrooms.mddapi.user.controller;

import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.payload.ProfileResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> profile(@AuthenticationPrincipal User user){
        return  ResponseEntity.ok(ProfileResponse.from(user));
    }
}
