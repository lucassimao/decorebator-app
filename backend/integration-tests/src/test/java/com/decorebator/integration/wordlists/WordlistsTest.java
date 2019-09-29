package com.decorebator.integration.wordlists;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.matchesRegex;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
import java.util.List;

import com.decorebator.beans.Word;
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
import io.restassured.response.ExtractableResponse;

/**
 * WordlistsTest
 * 
 * 
 */
public class WordlistsTest {

    private static final String WORDLIST_RESOURCE_REGEX = "/wordlists\\/\\S{24}$";

    private static final String yml = "../docker-compose.yml";

    @ClassRule
    public static DockerComposeContainer environment = new DockerComposeContainer(new File(yml)).withLocalCompose(true)
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
    public void registeredUserShouldBeAbleToCreateEmptyWordlist() {
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