package com.decorebator.integration.wordlists;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.when;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;

import com.decorebator.beans.Wordlist;
import com.decorebator.integration.TestUtils;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.testcontainers.containers.DockerComposeContainer;
import org.testcontainers.containers.wait.strategy.Wait;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

/**
 * Integration tests to ensure the endpoints are properly secured
 */
public class AccessControlTest {

    @ClassRule
    public static DockerComposeContainer environment = new DockerComposeContainer(new File(TestUtils.DOCKER_COMPOSER_YML)).withLocalCompose(true)
            .withExposedService("wordlists", 3000, Wait.forListeningPort())
            .withExposedService("auth", 3000, Wait.forListeningPort())
            .withExposedService("db", 27017, Wait.forListeningPort());

    private static String authHost, wordlistHost ;
    private static URL signInEndpoint, signUpEndpoint, wordlistEndpoint;
    private static int authPort, wordlistPort;

    @BeforeClass
    public static void setup() throws MalformedURLException {
        authHost = environment.getServiceHost("auth", 3000);
        authPort = environment.getServicePort("auth", 3000);
        signInEndpoint = new URL("http",authHost,authPort,"/signin");
        signUpEndpoint = new URL("http",authHost,authPort,"/signup");

        wordlistHost = environment.getServiceHost("wordlists", 3000);
        wordlistPort = environment.getServicePort("wordlists", 3000);
        wordlistEndpoint = new URL("http",wordlistHost,wordlistPort,"/wordlists");

        RestAssured.baseURI = wordlistEndpoint.toString();
    }

    @Before
    public void clearMongoDb() {
        String mongodbHost = environment.getServiceHost("db", 27017);
        int mongodbPort = environment.getServicePort("db", 27017);
        TestUtils.clearMongoDb(mongodbHost,mongodbPort);
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
        var wordlist = new Wordlist(null, "foo wordlist", "test", "pt-br", Collections.emptyList());

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