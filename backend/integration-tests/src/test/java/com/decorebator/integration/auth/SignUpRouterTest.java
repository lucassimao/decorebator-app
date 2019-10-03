package com.decorebator.integration.auth;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import com.decorebator.beans.UserRegistration;
import com.decorebator.integration.EnvironmentRule;

import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

/**
 * 
 * Integration tests for /signup microservice
 */
public class SignUpRouterTest {

    @ClassRule
    public static EnvironmentRule environmentRule = new EnvironmentRule(true);

    @BeforeClass
    public static void setup() {
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
        RestAssured.baseURI = environmentRule.getAuthHostAndPort();
    }

    @Test
    public void shouldBeAbleToRegisterANewUser() {
        var userRegistration  = new UserRegistration("lsimaocosta@gmail.com", "Lucas Simão","123456789","BR" );

        given()
            .contentType(ContentType.JSON)
            .body(userRegistration)
        .when()
            .post("/signup")
        .then()
            .statusCode(200);
    }

    @Test
    public void shouldDenyRegistrationWithSameEmail() {
        var userRegistration  = new UserRegistration("sigup.test@gmail.com", "Lucas Simão","123456789","BR" );
        var userRegistration2  = new UserRegistration("sigup.test@gmail.com", "any name","sssss","BR" );

        given()
            .contentType(ContentType.JSON)
            .body(userRegistration)
        .when()
            .post("/signup")
        .then()
            .statusCode(200);


        given()
            .contentType(ContentType.JSON)
            .body(userRegistration2)
        .when()
            .post("/signup")
        .then()
            .statusCode(400)
            .body(equalTo("User already exists"));
    }

    @Test
    public void shouldDenyRegisteringWithInvalidEmail() {
        var userRegistration  = new UserRegistration("invalid email", "Lucas Simão","123456789","BR" );

        given()
            .contentType(ContentType.JSON)
            .body(userRegistration)
        .when()
            .post("/signup")
        .then()
            .statusCode(400)
            .body(equalTo("A valid email must be used as your account login"));    
    }


    @Test
    public void shouldDenyRegisteringWithInvalidCountryCode() {
        var userRegistration  = new UserRegistration("sigup.test@gmail.com", "any name","any pawd","wrong country code" );

        given()
            .contentType(ContentType.JSON)
            .body(userRegistration)
        .when()
            .post("/signup")
        .then()
            .statusCode(400)
            .body(equalTo("Invalid country"));    
    }    

}