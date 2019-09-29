package com.decorebator.integration.wordlists;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;

import com.decorebator.integration.TestUtils;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.testcontainers.containers.DockerComposeContainer;
import org.testcontainers.containers.wait.strategy.Wait;

import io.restassured.RestAssured;

/**
 * Integration tests for wordlists' listing pagination endpoint 
 * 
 */
public class WordlistsPaginationTest {

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
    public void ensureOnly10WordlistsAreReturned() throws MalformedURLException {
        var authHost = environment.getServiceHost("auth", 3000);
        var authPort = environment.getServicePort("auth", 3000);
        var signInEndpoint = new URL("http",authHost,authPort,"/signin");
        var signUpEndpoint = new URL("http",authHost,authPort,"/signup");

        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);

        var wordlistHost = environment.getServiceHost("wordlists", 3000);
        var wordlistPort = environment.getServicePort("wordlists", 3000);
        var wordlistsEndpoint = new URL("http",wordlistHost,wordlistPort,"/wordlists");

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