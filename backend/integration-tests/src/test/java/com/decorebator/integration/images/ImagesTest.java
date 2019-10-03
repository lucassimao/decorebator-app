package com.decorebator.integration.images;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

import com.decorebator.beans.Image;
import com.decorebator.beans.Word;
import com.decorebator.beans.Wordlist;
import com.decorebator.integration.EnvironmentRule;
import com.decorebator.integration.TestUtils;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for word's image upload API
 * 
 */
public class ImagesTest {

    @ClassRule
    public static EnvironmentRule environmentRule = new EnvironmentRule(true);

    private String authorization;
    private String wordlistUri;
    private String firstWordId;
    final static File file = new File(ImagesTest.class.getClassLoader().getResource("book.jpeg").getFile());
    
    @BeforeClass
    public static void setup(){
        RestAssured.baseURI = environmentRule.getWordlistHostAndPort();
    }


    @Before
    public void createNewWordlist() {
        var userRegistration =  TestUtils.createRandomUser(environmentRule.getSignUpEndpoint());
        this.authorization = TestUtils.signIn(userRegistration.getLogin(), userRegistration.getPassword(), environmentRule.getSignInEndpoint());

        var words = List.of(new Word("book"));
        var wordlist = new Wordlist("Some movie subtitle", "Movie XPTO subtitle", "EN", words);
        
        this.wordlistUri = given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(wordlist)
        .when()
            .post("/wordlists")
        .then()
            .statusCode(201)
            .extract()
            .header("link");        

        this.firstWordId = given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
        .when()
            .get(wordlistUri + "/words")
        .then()
            .statusCode(200)
            .body("words.size()", is(1))
            .extract()
            .body().path("words[0]._id");            
    }

    @Test
    public void shouldReceiveA404TryingToCreateImageOnInexistingWordlist() throws IOException {
        // wordlist and word don't exist
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
        .when()
            .post("/wordlists/111111111111/words/000000000000/images")
        .then()
            .statusCode(404);
    }    

    @Test
    public void shouldReceiveA404TryingToCreateImageOnInexistingWord() throws IOException {
        // existing wordlist and inexisting word
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
        .when()
            .post(wordlistUri + "/words/000000000000/images")
        .then()
            .statusCode(404);
    }

    @Test
    public void authenticatedUserShouldBeAbleToAddImagesToHisWords() throws IOException {
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
        .when()
            .post(wordlistUri + "/words/" + firstWordId + "/images")
        .then()
            .statusCode(201)
            .header("link", matchesPattern(wordlistUri +  "/words/" + firstWordId + "/images/\\S+") );
    }


    @Test
    public void authenticatedUserShouldBeAbleToPatchHisOwnImages() throws IOException {
        
        var imageUri = given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
        .when()
            .post(wordlistUri + "/words/" + firstWordId + "/images")
        .then()
            .statusCode(201)
            .header("link", matchesPattern(wordlistUri +  "/words/" + firstWordId + "/images/\\S+") )
            .extract()
            .header("link");

        var s3UrlBeforePatch = given()
            .header("authorization", "bearer " + authorization)
        .when()
            .get(wordlistUri + "/words/" + firstWordId)
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)   
            .body("images.size()", is(1))
            .extract()
            .body()
            .path("images[0].url");

        // trying to patch the full object
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"updated description"))
        .when()
            .patch(imageUri)
        .then()
            .statusCode(204);

        // ensuring only the description field was updated. To update the image, user should delete it
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .get(wordlistUri + "/words/" + firstWordId)
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)   
            .body("images.size()", is(1))
            .body("images[0].url",is(s3UrlBeforePatch) )
            .body("images[0].description",is("updated description") ); 


    }

    @Test
    public void authenticatedUserShouldBeAbleToDeleteHisOwnImages() throws IOException {

        var imageURI = given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
        .when()
            .post(wordlistUri + "/words/" + firstWordId + "/images")
        .then()
            .statusCode(201)
            .header("link", matchesPattern(wordlistUri +  "/words/" + firstWordId + "/images/\\S+") )
            .extract()
            .header("link");

        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .delete(imageURI)
        .then()
            .statusCode(204);
    }    


    @Test
    public void shouldReceiveA404TryingToDeleteInexistingImages() throws IOException {
        // inexisting image
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .delete(wordlistUri + "/words/" + firstWordId + "/images/000000000000")
        .then()
            .statusCode(404);

        // inexisting word and image
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .delete(wordlistUri + "/words/000000000000/images/000000000000")
        .then()
            .statusCode(404); 
            
        // inexisting wordlist, word and image
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .delete("/wordlists/111111111111/words/000000000000/images/000000000000")
        .then()
            .statusCode(404);              
    }    


    @Test
    public void shouldReceiveA404TryingToPatchInexistingImages() throws IOException {
        // inexisting image
        given()
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
            .contentType(ContentType.JSON)
        .when()
            .patch(wordlistUri + "/words/" + firstWordId + "/images/000000000000")
        .then()
            .statusCode(404);

        // inexisting word and image
        given()
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
            .contentType(ContentType.JSON)
        .when()
            .patch(wordlistUri + "/words/000000000000/images/000000000000")
        .then()
            .statusCode(404); 
            
        // inexisting wordlist, word and image
        given()
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
            .contentType(ContentType.JSON)
        .when()
            .patch("/wordlists/111111111111/words/000000000000/images/000000000000")
        .then()
            .statusCode(404);              
    }     
    
}