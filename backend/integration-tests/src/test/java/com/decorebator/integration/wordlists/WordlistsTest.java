package com.decorebator.integration.wordlists;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;

import com.decorebator.beans.UserLogin;
import com.decorebator.beans.UserRegistration;
import com.decorebator.beans.Wordlist;
import com.decorebator.integration.TestUtils;

import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.testcontainers.containers.DockerComposeContainer;
import org.testcontainers.containers.wait.strategy.Wait;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

/**
 * WordlistsTest
 * 
 * 
 */
public class WordlistsTest {

    private static final String yml = "../docker-compose.yml";

    @ClassRule
    public static DockerComposeContainer environment = new DockerComposeContainer(new File(yml)).withLocalCompose(true)
            .withExposedService("wordlists", 3000, Wait.forListeningPort())
            .withExposedService("auth", 3000, Wait.forListeningPort())
            .withExposedService("db", 27017, Wait.forListeningPort());

    @BeforeClass
    public static void setup() {
        String wordlistsHost = environment.getServiceHost("wordlists", 3000);
        int wordlistPort = environment.getServicePort("wordlists", 3000);
        RestAssured.baseURI = String.format("http://%s:%d/wordlists", wordlistsHost, wordlistPort);
    }

    @Before
    public void clearMongoDb() {
        String mongodbHost = environment.getServiceHost("db", 27017);
        int mongodbPort = environment.getServicePort("db", 27017);
        TestUtils.clearMongoDb(mongodbHost,mongodbPort);
    }

    @Test
    public void shouldReturnStatus401ForNoAuthenticatedRequests() throws MalformedURLException {
        var wordlist = new Wordlist(null, "foo wordlist", "test", "pt-br", Collections.emptyList());

        when().get("/").then().statusCode(401);
        given()
            .body(wordlist)
            .contentType(ContentType.JSON)
        .when()
            .post("/")
        .then()
            .statusCode(401);

        URL signinEndpoint = new URL("http",environment.getServiceHost("auth", 3000),environment.getServicePort("auth", 3000),"/signin");
        URL signupEndpoint = new URL("http",environment.getServiceHost("auth", 3000),environment.getServicePort("auth", 3000),"/signup");
        URL wordlistsEndpoint = new URL("http",environment.getServiceHost("wordlists", 3000),environment.getServicePort("wordlists", 3000),"/wordlists");

        var link = TestUtils.createRandomWordlist(signupEndpoint,signinEndpoint,wordlistsEndpoint);

    }

}