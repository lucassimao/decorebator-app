package com.decorebator.integration.words;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.when;
import static org.junit.Assert.assertThat;
import static io.restassured.RestAssured.get;
import static io.restassured.RestAssured.delete;
import static org.hamcrest.Matchers.*;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

import com.decorebator.beans.Word;
import com.decorebator.beans.Wordlist;
import com.decorebator.integration.TestUtils;

import org.hamcrest.CoreMatchers;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.testcontainers.containers.DockerComposeContainer;
import org.testcontainers.containers.wait.strategy.Wait;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.ExtractableResponse;

/**
 * Integration tests to ensure the endpoints are properly secured
 * 
 */
public class AccessControlTest {

    private static final String yml = "../docker-compose.yml";

    @ClassRule
    public static DockerComposeContainer environment = new DockerComposeContainer(new File(yml)).withLocalCompose(true)
            .withExposedService("wordlists", 3000, Wait.forListeningPort())
            .withExposedService("auth", 3000, Wait.forListeningPort());

    private static String authHost, wordlistHost ;
    private static URL signInEndpoint, signUpEndpoint, wordlistEndpoint;
    private static int authPort, wordlistPort;
    private static String wordlistUri, _1stWordUri;

    @BeforeClass
    public static void setup() throws MalformedURLException {
        authHost = environment.getServiceHost("auth", 3000);
        authPort = environment.getServicePort("auth", 3000);
        signInEndpoint = new URL("http",authHost,authPort,"/signin");
        signUpEndpoint = new URL("http",authHost,authPort,"/signup");

        wordlistHost = environment.getServiceHost("wordlists", 3000);
        wordlistPort = environment.getServicePort("wordlists", 3000);
        wordlistEndpoint = new URL("http",wordlistHost,wordlistPort,"");

        RestAssured.baseURI = wordlistEndpoint.toString();

        // registering a new user and his single wordlist
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        
        var words = List.of(new Word("scrambled"),new Word("behind the ball 8"),new Word("flake"));
        var wordlist = new Wordlist(null,"wordlist test","name of the wordlist","en", words);

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
        _1stWordUri = given()
                        .header("authorization", "bearer " + authorization)
                      .when()
                        .get(wordlistUri)
                    .then()
                        .statusCode(200)
                        .extract()
                        .body()
                        .path("words[0]._id");

        assertThat(_1stWordUri, CoreMatchers.not(emptyOrNullString()));
    }

    @Test
    public void unauthenticatedUserShouldNotManipulateWords() {

        get(wordlistUri + "/words/" + _1stWordUri)
        .then()
            .statusCode(401);

        given()
            .body(new Word("hacked"))
            .contentType(ContentType.JSON)
        .when()
            .post(wordlistUri + "/words")
        .then()
            .statusCode(401);

        given()
            .body(new Word("hacked"))
            .contentType(ContentType.JSON)
        .when()
            .patch(wordlistUri + "/words/" + _1stWordUri)
        .then()
            .statusCode(401);            

        delete(wordlistUri + "/words/" + _1stWordUri)
        .then()
            .statusCode(401);            
    }    


}