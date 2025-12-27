package om.openclassrooms.mddapi.user.repository;

import om.openclassrooms.mddapi.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCaseOrUsernameIgnoreCase(String email, String username);

    Optional<User> findByUsername(String username); //TODO: Look like redundant method, recheck
    Optional<User> findByEmail(String email);  //TODO: Look like redundant method, recheck

    Boolean existsByEmailIgnoreCase(String email);
    Boolean existsByUsernameIgnoreCase(String username);

    Boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
    Boolean existsByUsernameIgnoreCaseAndIdNot(String username, Long id);
}
