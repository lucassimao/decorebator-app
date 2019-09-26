package com.decorebator.integration.auth;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.matchesPattern;
import static org.hamcrest.Matchers.equalTo;

import java.io.File;

import com.decorebator.beans.UserLogin;
import com.decorebator.beans.UserRegistration;

import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.testcontainers.containers.DockerComposeContainer;
import org.testcontainers.containers.wait.strategy.Wait;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

/**
 * Integration tests for /signin route
 */
public class SignInRouterTest 
{

    private static final String yml = "../docker-compose.yml";

    @ClassRule
    public static DockerComposeContainer environment = new DockerComposeContainer(new File(yml))
            .withLocalCompose(true)
            .withExposedService("auth", 3000,Wait.forListeningPort());

            
    @BeforeClass
    public static void setup() {
        var host = environment.getServiceHost("auth", 3000);
        var port = environment.getServicePort("auth", 3000);

        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
        RestAssured.baseURI = String.format("http://%s:%d",host,port);
    }

    @Test
    public void userShouldBeAbleToSignIn()
    {
        var userRegistration  = new UserRegistration("sigin.test@gmail.com", "Lucas Simão","123456789","BR" );
        var userLogin  = new UserLogin("sigin.test@gmail.com","123456789" );

        given()
            .contentType(ContentType.JSON)
            .body(userRegistration)
        .when()
            .post("/signup")
        .then()
            .statusCode(200);

        given()
            .contentType(ContentType.JSON)
            .body(userLogin)
        .when()
            .post("/signin")
        .then()
            .statusCode(200)
            .header("authorization", matchesPattern("^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+/=]*$"));
    }

    @Test
    public void inexistingUserShouldNotBeAbleToLogin() {
        var userLogin  = new UserLogin("inexisting@gmail.com","123456789" );

        given()
            .contentType(ContentType.JSON)
            .body(userLogin)
        .when()
            .post("/signin")
        .then()
            .statusCode(400)
            .body(equalTo("Wrong password or username"));        
    }

}
