package com.decorebator.integration.auth;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.equalTo;

import java.io.File;

import com.decorebator.beans.UserRegistration;
import com.decorebator.integration.TestUtils;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.BsonDocument;
import org.bson.Document;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.testcontainers.containers.DockerComposeContainer;
import org.testcontainers.containers.wait.strategy.Wait;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

/**
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
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
        RestAssured.baseURI = String.format("http://%s:3000",host);
    }

    @Before
    public void clearMongoDb() {
        String mongodbHost = environment.getServiceHost("db", 27017);
        int mongodbPort = environment.getServicePort("db", 27017);
        
        TestUtils.clearMongoDb(mongodbHost,mongodbPort);
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