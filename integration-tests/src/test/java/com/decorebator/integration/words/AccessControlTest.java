package com.decorebator.integration.words;

import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertThat;
import static io.restassured.RestAssured.get;
import static io.restassured.RestAssured.delete;
import static org.hamcrest.Matchers.*;

import java.net.MalformedURLException;
import java.util.List;

import com.decorebator.beans.Word;
import com.decorebator.beans.Wordlist;
import com.decorebator.integration.EnvironmentRule;
import com.decorebator.integration.TestUtils;

import org.hamcrest.CoreMatchers;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.ExtractableResponse;

/**
 * Integration tests to ensure the endpoints are properly secured
 * 
 */
public class AccessControlTest {

    @ClassRule
    public static EnvironmentRule environmentRule = new EnvironmentRule(false);
    private static String wordlistUri;
    private static Integer _1stWordId;

    @BeforeClass
    public static void setup() throws MalformedURLException {
        RestAssured.baseURI = environmentRule.getWordlistHostAndPort();

        // registering a new user and his single wordlist
        var registration = TestUtils.createRandomUser(environmentRule.getSignUpEndpoint());
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), environmentRule.getSignInEndpoint());
        
        var words = List.of(new Word("scrambled"),new Word("behind the ball 8"),new Word("flake"));
        var wordlist = new Wordlist("wordlist test","name of the wordlist","en", words);

        ExtractableResponse response = given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(wordlist)
        .when()
            .post("/wordlists")
        .then()
            .statusCode(201)
            .extract();

        wordlistUri = response.header("link");
        _1stWordId = given()
                        .header("authorization", "bearer " + authorization)
                      .when()
                        .get(wordlistUri+"/words")
                    .then()
                        .statusCode(200)
                        .extract()
                        .body()
                        .path("[0].id");

        assertThat(_1stWordId, CoreMatchers.not(nullValue()));
    }

    @Test
    public void unauthenticatedUserShouldNotManipulateWords() {

        // trying to read all words
        get(wordlistUri + "/words")
        .then()
            .statusCode(401);

        // trying to read a single word
        get(wordlistUri + "/words/" + _1stWordId)
        .then()
            .statusCode(401);

        // trying to add a new word
        given()
            .body(new Word("hacked"))
            .contentType(ContentType.JSON)
        .when()
            .post(wordlistUri + "/words")
        .then()
            .statusCode(401);

        // trying to patch a single word
        given()
            .body(new Word("hacked"))
            .contentType(ContentType.JSON)
        .when()
            .patch(wordlistUri + "/words/" + _1stWordId)
        .then()
            .statusCode(401);            

        // trying to delete a word
        delete(wordlistUri + "/words/" + _1stWordId)
        .then()
            .statusCode(401);            
    }    


    @Test
    public void authenticatedUserShouldOnlyManipulateHisOwnWords() {
        // registering a new user
        var registration = TestUtils.createRandomUser(environmentRule.getSignUpEndpoint());
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), environmentRule.getSignInEndpoint());

        // shouldn't read others wordlists' words
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .get(wordlistUri + "/words")
        .then()
            .statusCode(403);
            
        // shoudn't read others wordlists' words
        given()
            .header("authorization", "bearer " + authorization)
        .when()        
            .get(wordlistUri + "/words/" + _1stWordId)
        .then()
            .statusCode(403);

        // shoudn't add words to others wordlists
        given()
            .body(new Word("hacked"))
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
        .when()
            .post(wordlistUri + "/words")
        .then()
            .statusCode(403);

        // shoudn't patch others wordlists' words
        given()
            .body(new Word("hacked"))
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
        .when()
            .patch(wordlistUri + "/words/" + _1stWordId)
        .then()
            .statusCode(403);            

        // shoudn't delete others wordlists' words
        given()
            .header("authorization", "bearer " + authorization)
        .when()         
            .delete(wordlistUri + "/words/" + _1stWordId)
        .then()
            .statusCode(403);          
    }


}