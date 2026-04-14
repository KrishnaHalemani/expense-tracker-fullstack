package com.expense.tracker.auth;

import com.expense.tracker.entity.User;
import com.expense.tracker.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.expense.tracker.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {
    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
        this.jwtUtil=jwtUtil;
    }

    @GetMapping("/test")
    public String test() {
        return "WORKING";
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest registerRequest) {

        if(userRepository.findByEmail(registerRequest.email).isPresent()){
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(registerRequest.name);
        user.setEmail(registerRequest.email);
        user.setPassword(passwordEncoder.encode(registerRequest.password));

        userRepository.save(user);

        return "User Registered";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest){

        User user = userRepository.findByEmail(loginRequest.email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(loginRequest.password, user.getPassword())){
            throw new RuntimeException("Invalid Password");
        }

        return jwtUtil.generateToken(user.getEmail());
    }



}
