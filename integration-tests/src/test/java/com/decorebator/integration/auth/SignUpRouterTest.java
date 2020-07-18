package com.decorebator.integration.auth;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import com.decorebator.beans.UserRegistration;
import com.decorebator.integration.EnvironmentRule;

import static org.hamcrest.collection.IsArrayWithSize.arrayWithSize;
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
            .body("size()",equalTo(1))
            .body("[0].message",equalTo("email must be unique"));
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
            .body("size()",equalTo(1))
            .body("[0].message",equalTo("Validation isEmail on email failed"));            
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
            .body("size()",equalTo(1))
            .body("[0].message",equalTo("Validation isIn on country failed"));            
    }    

}