package com.decorebator.integration.wordlists;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.when;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;

import com.decorebator.beans.Wordlist;
import com.decorebator.integration.EnvironmentRule;
import com.decorebator.integration.TestUtils;

import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

/**
 * Integration tests to ensure the endpoints are properly secured
 */
public class AccessControlTest {

    @ClassRule
    public static EnvironmentRule env = new EnvironmentRule(true);
	private static URL signInEndpoint, signUpEndpoint, wordlistEndpoint;


    @BeforeClass
    public static void setup() throws MalformedURLException {
        signInEndpoint = env.getSignInEndpoint();
        signUpEndpoint = env.getSignUpEndpoint();
        wordlistEndpoint = env.getWordlistEndpoint();

        RestAssured.baseURI = wordlistEndpoint.toString();
    }


    @Test
    public void shouldDenyNoAuthenticatedListingOfWordlists() {
        when()
            .get("/")
        .then()
            .statusCode(401);
    }

    @Test
    public void unauthenticatedUserShouldNotCreateWordlist() {
        var wordlist = new Wordlist("foo wordlist", "test", "pt-br", Collections.emptyList());

        given()
            .body(wordlist)
            .contentType(ContentType.JSON)
        .when()
            .post("/")
        .then()
            .statusCode(401);
    }    

    @Test
    public void unauthenticatedUserShouldNotBeAbleToChangeExistingWordlists() throws MalformedURLException {
        String resourceUri = TestUtils.createRandomWordlist(signUpEndpoint, signInEndpoint, wordlistEndpoint);
        String resourceId = resourceUri.substring("/wordlists".length());


        when().delete(resourceId).then().statusCode(401);

        when().get(resourceId).then().statusCode(401);

        given()
            .contentType(ContentType.JSON)
            .body("{\"name\":\"hacked wordlist\"}")
        .when()
            .patch(resourceId)
        .then()
            .statusCode(401);
    }

    @Test
    public void userShouldOnlyBeAbleToSeeHisOwnWordlists() {
        var resourceUri = TestUtils.createRandomWordlist(signUpEndpoint, signInEndpoint, wordlistEndpoint);
        var resourceId = resourceUri.substring("/wordlists".length());

        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);

        // trying to GET a wordlist of another user
        given()
            .header("authorization","bearer " + authorization)
        .when()
            .get(resourceId)
        .then()
            .statusCode(403);   
            
        // trying to PATCH a wordlist of another user
        given()
            .header("authorization","bearer " + authorization)
            .body("{\"name\":\"hacked wordlist\"}")
        .when()
            .get(resourceId)
        .then()
            .statusCode(403);  


       // trying to DELETE a wordlist of another user
        given()
            .header("authorization","bearer " + authorization)
        .when()
            .delete(resourceId)
        .then()
            .statusCode(403);              

    }

}