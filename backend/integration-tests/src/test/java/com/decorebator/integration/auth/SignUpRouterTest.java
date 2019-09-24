package com.decorebator.integration.auth;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.matchesPattern;
import static org.hamcrest.Matchers.equalTo;

import java.io.File;

import com.decorebator.beans.UserLogin;
import com.decorebator.beans.UserRegistration;
import com.github.dockerjava.api.DockerClient;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.testcontainers.containers.DockerComposeContainer;
import org.testcontainers.containers.wait.strategy.Wait;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

/**
 * SignUpRouterTest
 * 
 * Integration tests for /signup microservice
 */
public class SignUpRouterTest {

    private static final String yml = "../docker-compose.yml";
    @ClassRule
    public static DockerComposeContainer environment = new DockerComposeContainer(new File(yml)).withLocalCompose(true)
            .withExposedService("auth", 3000, Wait.forListeningPort())
            .withExposedService("db", 27017, Wait.forListeningPort());

    @BeforeClass
    public static void setup() {
        String host = environment.getServiceHost("auth", 3000);
        RestAssured.baseURI = "http://" + host + ":3000";
    }

    @Before
    public void clearMongoDb() {
        String mongodbHost = environment.getServiceHost("db", 27017);
        String uri = "mongodb://" + mongodbHost + ":27017";
        MongoClient mongoClient = MongoClients.create(uri);
        mongoClient.getDatabase("decorebator").drop();
        mongoClient.close();
    }

    @Test
    public void shouldBeAbleToRegisterANewUser() {
        var userRegistration  = new UserRegistration("sigup.test@gmail.com", "Lucas Simão","123456789","BR" );

        given()
            .contentType(ContentType.JSON)
            .body(userRegistration)
        .when()
            .post("/signup")
        .then()
            .statusCode(200);
    }

    @Test
    public void shouldDenyRegistrationOfDuplicatedUsers() {
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