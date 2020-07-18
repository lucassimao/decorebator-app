package com.decorebator.integration.wordlists;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;

import java.net.MalformedURLException;

import com.decorebator.integration.EnvironmentRule;
import com.decorebator.integration.TestUtils;

import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;

import io.restassured.RestAssured;

/**
 * Integration tests for wordlists' listing pagination endpoint 
 * 
 */
public class WordlistsPaginationTest {

    @ClassRule
    public static EnvironmentRule env = new EnvironmentRule(true);

    @BeforeClass
    public static void setup() {
        RestAssured.baseURI = env.getWordlistEndpoint().toString();
    }

    @Test
    public void ensureOnly10WordlistsAreReturned() throws MalformedURLException {
        var signInEndpoint = env.getSignInEndpoint();
        var signUpEndpoint = env.getSignUpEndpoint();

        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);

        var wordlistsEndpoint = env.getWordlistEndpoint();

        // will generate 11 pages, from 0 to 10, and the last page must have a single item
        for(int i=0;i < 101;++i){
            TestUtils.createRandomWordlist(authorization, wordlistsEndpoint);
        }

        // requesting the first page without informing the page number
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .get(wordlistsEndpoint)
        .then()
            .statusCode(200)
            .body("wordlists.size()",is(10));

        // accessing specific pages
        for(int i=0;i< 11;++i){
            given()
                .header("authorization","bearer " + authorization)
                .param("page", i)
            .when()
                .get(wordlistsEndpoint)
            .then()
                .statusCode(200)
                .body("wordlists.size()",is( i == 10 ? 1 : 10)); // last page should have a single item
        }

        // 12th page should be empty
        given()
            .header("authorization","bearer " + authorization)
            .param("page", 11) // it's counting from 0
        .when()
            .get(wordlistsEndpoint)
        .then()
            .statusCode(200)
            .body("wordlists.size()",is(0));
        
    }

}