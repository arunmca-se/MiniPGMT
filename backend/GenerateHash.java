import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "password123";
        String hash = encoder.encode(password);
        System.out.println("BCrypt hash for '" + password + "':");
        System.out.println(hash);
        
        // Test if it matches
        boolean matches = encoder.matches(password, hash);
        System.out.println("Test match: " + matches);
    }
}
