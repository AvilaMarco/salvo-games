package com.codeoftheweb.salvo.dto.request;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

@Data
public class SignInPlayerDTO {

    @NotEmpty
    String name;

    @Email
    @NotEmpty
    String email;

    @NotEmpty
    String password;
}
