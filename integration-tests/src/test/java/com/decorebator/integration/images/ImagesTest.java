package com.decorebator.integration.images;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.matchesPattern;

import java.io.File;
import java.io.IOException;
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

import io.restassured.filter.log.LogDetail;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

/**
 * Integration tests for word's image upload API
 * 
 */
public class ImagesTest {

    @ClassRule
    public static EnvironmentRule environmentRule = new EnvironmentRule(true);

    private String authorization;
    private String wordlistUri;
    private Integer firstWordId;
    final static File file = new File(ImagesTest.class.getClassLoader().getResource("book.jpeg").getFile());
    
    @BeforeClass
    public static void setup(){
        RestAssured.baseURI = environmentRule.getWordlistHostAndPort();
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
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
            // .log().ifValidationFails(LogDetail.BODY)
            .statusCode(200)
            .body("size()", is(1))
            .extract()
            .body().path("[0].id");            
    }

    @Test
    public void shouldReceiveA500TryingToUseOutOfRangeIds() throws IOException {
        // wordlist and word don't exist
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
        .when()
            .post("/wordlists/111111111111/words/222222222222/images")
        .then()
            .statusCode(500);
    }

    @Test
    public void shouldReceiveA404TryingToCreateImageOnInexistingWordlist() throws IOException {
        // wordlist and word don't exist
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
        .when()
            .post("/wordlists/11/words/123/images")
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
            .post(wordlistUri + "/words/123/images")
        .then()
            .statusCode(404);
    }

    @Test
    public void authenticatedUserShouldBeAbleToAddImagesToHisWords() throws IOException {
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"open book"))
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
            .get(wordlistUri + "/words/" + firstWordId + "/images")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)   
            .body("size()", is(1))
            .extract()
            .body()
            .path("[0].url");

        // trying to patch the full object
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"updated description"))
        .when()
            .patch(imageUri)
        .then()
            .statusCode(204);

        // ensuring only the description field was updated. To update the image itself, user should delete it
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .get(wordlistUri + "/words/" + firstWordId +"/images")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)   
            .body("size()", is(1))
            .body("[0].url",is(s3UrlBeforePatch) )
            .body("[0].description",is("updated description") ); 


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
            .delete(wordlistUri + "/words/" + firstWordId + "/images/123")
        .then()
            .statusCode(404);

        // inexisting word and image
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .delete(wordlistUri + "/words/00/images/11")
        .then()
            .statusCode(404); 
            
        // inexisting wordlist, word and image
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .delete("/wordlists/22/words/33/images/44")
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
            .patch(wordlistUri + "/words/" + firstWordId + "/images/111")
        .then()
            .statusCode(404);

        // inexisting word and image
        given()
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
            .contentType(ContentType.JSON)
        .when()
            .patch(wordlistUri + "/words/111/images/101")
        .then()
            .statusCode(404); 
            
        // inexisting wordlist, word and image
        given()
            .header("authorization", "bearer " + authorization)
            .body(new Image(file,"opened book"))
            .contentType(ContentType.JSON)
        .when()
            .patch("/wordlists/202/words/303/images/404")
        .then()
            .statusCode(404);              
    }     
    
}