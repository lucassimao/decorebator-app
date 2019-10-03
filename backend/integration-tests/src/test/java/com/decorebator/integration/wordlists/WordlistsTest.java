package com.decorebator.integration.wordlists;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
import java.util.List;

import com.decorebator.beans.Word;
import com.decorebator.beans.Wordlist;
import com.decorebator.integration.EnvironmentRule;
import com.decorebator.integration.TestUtils;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.testcontainers.containers.DockerComposeContainer;
import org.testcontainers.containers.wait.strategy.Wait;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.ExtractableResponse;

/**
 * WordlistsTest
 * 
 * 
 */
public class WordlistsTest {

    private static final String WORDLIST_RESOURCE_REGEX = "/wordlists\\/\\S{24}$";


    @ClassRule
    public static EnvironmentRule environment = new EnvironmentRule(true);
    private static URL signUpEndpoint;
    private static URL signInEndpoint;    
        
    @BeforeClass
    public static void setup() throws MalformedURLException {
        RestAssured.baseURI = environment.getWordlistEndpoint().toString();
        signUpEndpoint = environment.getSignUpEndpoint();
        signInEndpoint = environment.getSignInEndpoint();
    }
	    

    @Test
    public void shouldNotBeAbleToCreateWordlistFromEmptyBody() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
        .when()
            .post("/")
        .then()
            .statusCode(400)
            .contentType(ContentType.JSON)
            .body("name.name",is("ValidatorError"))
            .body("description.name",is("ValidatorError"))
            .body("language.name",is("ValidatorError"));

    }    

    @Test
    public void registeredUserShouldBeAbleToCreateWordlistWithoutWords() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        var wordlist = new Wordlist(null,"wordlist test","name of the wordlist","pt-br", Collections.emptyList());
        
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(wordlist)
        .when()
            .post("/")
        .then()
            .statusCode(201)
            .header("link", matchesRegex(WORDLIST_RESOURCE_REGEX));
    }

    @Test
    public void registeredUserShouldBeAbleToCreateWordlistWithWords() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        
        var words = List.of(new Word("word"),new Word("straightforward"),new Word("tight"));
        var wordlist = new Wordlist(null,"wordlist test","name of the wordlist","pt-br", words);

        ExtractableResponse response = given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(wordlist)
        .when()
            .post("/")
        .then()
            .statusCode(201)
            .header("link", matchesRegex(WORDLIST_RESOURCE_REGEX))
            .extract();

        String resourceUri = response.header("link");
        String resourceId = resourceUri.substring("/wordlists".length());
    
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .get(resourceId)
        .then()
            .statusCode(200)
            .body("words.size()",is(3))
            .body("words.name",hasItems("word","straightforward","tight"));

    }


    @Test
    public void registeredUserShouldBeAbleToPatchHisOwnWordlists() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        
        var wordlist = new Wordlist(null,"wordlist description","wrong name","en", Collections.emptyList());

        ExtractableResponse response = given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(wordlist)
        .when()
            .post("/")
        .then()
            .statusCode(201)
            .header("link", matchesRegex(WORDLIST_RESOURCE_REGEX))
            .extract();

        String resourceUri = response.header("link");
        String resourceId = resourceUri.substring("/wordlists".length());
    
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body("{\"name\":\"fixed wordlist name\"}")
        .when()
            .patch(resourceId)
        .then()
            .statusCode(204);
    }    


    @Test
    public void registeredUserShouldBeAbleToDeleteHisOwnWordlists() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        
        var wordlist = new Wordlist(null,"wordlist description","wordlist to be deleted","en", Collections.emptyList());

        ExtractableResponse response = given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(wordlist)
        .when()
            .post("/")
        .then()
            .statusCode(201)
            .header("link", matchesRegex(WORDLIST_RESOURCE_REGEX))
            .extract();

        String resourceUri = response.header("link");
        String resourceId = resourceUri.substring("/wordlists".length());
    
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
        .when()
            .delete(resourceId)
        .then()
            .statusCode(204);
    }      

    @Test
    public void shouldReceiveA404WhenAccessingInexistingResources() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
        .when()
            .get("/000000000000")
        .then()
            .statusCode(404);

        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
        .when()
            .delete("/000000000000")
        .then()
            .statusCode(404);            
    }    
  

}