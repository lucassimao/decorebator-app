package com.decorebator.integration.images;

import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertThat;
import static io.restassured.RestAssured.get;
import static io.restassured.RestAssured.delete;
import static org.hamcrest.Matchers.*;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;

import com.decorebator.beans.Image;
import com.decorebator.beans.Word;
import com.decorebator.beans.Wordlist;
import com.decorebator.integration.EnvironmentRule;
import com.decorebator.integration.TestUtils;

import org.hamcrest.CoreMatchers;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.slf4j.LoggerFactory;

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
	private static String wordlistUri, _1stWordId, imageURI;

    @BeforeClass
    public static void setup() throws IOException, URISyntaxException {
        RestAssured.baseURI = environmentRule.getWordlistHostAndPort();

        // registering a new user and his single wordlist
        var registration = TestUtils.createRandomUser(environmentRule.getSignUpEndpoint());
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), environmentRule.getSignInEndpoint());
        
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
        _1stWordId = given()
                        .header("authorization", "bearer " + authorization)
                      .when()
                        .get(wordlistUri)
                    .then()
                        .statusCode(200)
                        .extract()
                        .body()
                        .path("words[0]._id");

        assertThat(_1stWordId, not(emptyOrNullString()));

        var url = AccessControlTest.class.getClassLoader().getResource("book.jpeg");
        var file = new File(url.toURI());        

        imageURI = given()
                    .header("authorization", "bearer " + authorization)
                    .body(new Image(file,"Book image"))
                    .contentType(ContentType.JSON)
                .when()
                    .post(wordlistUri + "/words/" +_1stWordId + "/images")
                .then()
                    .statusCode(201)
                    .extract()
                    .header("link");

        assertThat(imageURI, not(emptyOrNullString()));

    }

    @Test(timeout=4000)
    public void unauthenticatedUserShallNotAddImagesToWords() throws IOException, URISyntaxException {

        URL url = AccessControlTest.class.getClassLoader().getResource("teste.png");
        var file = new File(url.toURI());

        given()
            .body(new Image(file,"twitter screenshot"))
            .contentType(ContentType.JSON)
        .post(wordlistUri + "/words/" + _1stWordId + "/images")
        .then()
            .statusCode(401);
    }  
    
    
    @Test(timeout=4000)
    public void unauthenticatedUserShallNotDeleteImageWords() throws IOException, URISyntaxException {

        delete(imageURI)
        .then()
            .statusCode(401);
    }  
    
    @Test(timeout=4000)
    public void unauthenticatedUserShallNotPatchImageWords() throws IOException, URISyntaxException {
        URL url = AccessControlTest.class.getClassLoader().getResource("teste.png");
        var file = new File(url.toURI());

        given()
            .body(new Image(file,"hacked image"))
            .contentType(ContentType.JSON)
        .patch(imageURI)
        .then()
            .statusCode(401);
    }    

    @Test(timeout=4000)
    public void authenticatedUserShouldOnlyManipulateHisOwnWords() throws URISyntaxException, IOException {
        var registration = TestUtils.createRandomUser(environmentRule.getSignUpEndpoint());
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), environmentRule.getSignInEndpoint());
        URL url = AccessControlTest.class.getClassLoader().getResource("teste.png");
        var file = new File(url.toURI());

        // shalln't add a new image to an existing word
        given()
            .body(new Image(file, "hacked image"))
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
        .when()
            .post(wordlistUri + "/words/" +_1stWordId + "/images")
        .then()
            .statusCode(403);
            
        // shalln't delete other users word's image
        given()
            .header("authorization", "bearer " + authorization)
        .when()        
            .delete(imageURI)
        .then()
            .statusCode(403);

        // shalln't patch other users word's image
        given()
            .body(new Image(file, "hacked image"))
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
        .when()
            .patch(imageURI)
        .then()
            .statusCode(403);

    }


}