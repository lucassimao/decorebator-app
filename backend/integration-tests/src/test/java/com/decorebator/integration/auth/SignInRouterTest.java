package com.decorebator.integration.auth;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.matchesPattern;

import com.decorebator.beans.UserLogin;
import com.decorebator.beans.UserRegistration;
import com.decorebator.integration.EnvironmentRule;

import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

/**
 * Integration tests for /signin route
 */
public class SignInRouterTest 
{


    @ClassRule
    public static EnvironmentRule environmentRule = new EnvironmentRule(false);

            
    @BeforeClass
    public static void setup() {
        RestAssured.baseURI = environmentRule.getAuthHostAndPort();
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
