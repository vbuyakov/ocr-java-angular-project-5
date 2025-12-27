
## Planned Structure (To Be Implemented)

### Security Package
- `security/jwt/`
  - `JwtAuthenticationFilter.java`
  - `JwtUtils.java`
  - `JwtProperties.java`
- `security/service/`
  - `UserDetailsServiceImpl.java`
- `security/exception/`
  - `JwtAuthenticationEntryPoint.java`
- `security/util/`
  - `SecurityUtils.java`

### Auth Package (Additional)
- `auth/service/`
  - `AuthService.java`
- `auth/dto/` (or `auth/payload/`)
  - `LoginRequest.java`
  - `JwtResponse.java`

### User Package (Additional)
- `user/repository/`
  - `UserRepository.java`
- `user/service/`
  - `UserService.java`
- `user/dto/` (or `user/payload/`)
  - `UserResponse.java`
  - `UserCreateRequest.java`
  - `UserUpdateRequest.java`

### Content Package (Additional)
- `content/model/`
  - `Article.java` (in addition to existing `Topic.java`)
- `content/repository/`
  - `ArticleRepository.java` (in addition to existing `TopicRepository.java`)
- `content/service/`
  - `ArticleService.java` (in addition to existing `TopicService.java`)
- `content/controller/`
  - `ArticleController.java` (in addition to existing `TopicController.java`)
- `content/payload/`
  - `ArticleRequest.java` (in addition to existing `TopicRequest.java`)
  - `ArticleResponse.java` (in addition to existing `TopicResponse.java`)

### Common Package (Additional)
- `common/exception/`
  - `NotFoundException.java`