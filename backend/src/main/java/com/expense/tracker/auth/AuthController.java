package com.expense.tracker.auth;

import com.expense.tracker.entity.User;
import com.expense.tracker.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@CrossOrigin
public class AuthController {
    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository=userRepository;
    }


    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest registerRequest) {
        User user=new User();
        user.setName(registerRequest.name);
        user.setEmail(registerRequest.email);
        user.setPassword(registerRequest.password);

        userRepository.save(user);

        return "User Registered";

    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest){
        User user = userRepository.findByEmail(loginRequest.email)
                .orElseThrow(()-> new RuntimeException("User not found"));
        if(!user.getPassword().equals(loginRequest.password)){
            throw new RuntimeException("Invalid Password");
        }
        return "Login Success";
    }

}
