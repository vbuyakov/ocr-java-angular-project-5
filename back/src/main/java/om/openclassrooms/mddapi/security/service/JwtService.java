package om.openclassrooms.mddapi.security.service;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    @Value("${spring.security.jwt.expiration-time}")
    private Long jwtExpiration;

    @Value("${spring.security.jwt.secret-key}")
    private String jwtSecret;

    public String generateToken(Long userId){
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + this.jwtExpiration))
                .signWith(getJwtSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Long extractUserId(String token){
        return Long.parseLong(Jwts.parserBuilder()
                .setSigningKey(getJwtSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject());
    }

    public boolean isTokenValid(String authToken){
        try{
            Jwts.parserBuilder()
                    .setSigningKey(getJwtSecretKey())
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch(JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    private Key getJwtSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }



}
