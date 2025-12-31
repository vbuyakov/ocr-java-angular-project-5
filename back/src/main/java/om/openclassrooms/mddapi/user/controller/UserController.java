package om.openclassrooms.mddapi.user.controller;

import om.openclassrooms.mddapi.user.model.User;
import om.openclassrooms.mddapi.user.payload.ProfileResponse;
import om.openclassrooms.mddapi.user.payload.ProfileUpdateRequest;
import om.openclassrooms.mddapi.user.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ProfileResponse profile(@AuthenticationPrincipal User user){
        return userService.getUserProfile(user.getId());
    }

    @PutMapping("/profile")
    public ProfileResponse updateProfile(ProfileUpdateRequest profile, @AuthenticationPrincipal User user){
        return userService.updateUserProfile(profile, user.getId());
    }
}
