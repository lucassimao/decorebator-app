package com.decorebator.integration.words;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.emptyOrNullString;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;

import java.util.List;

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
import io.restassured.response.ExtractableResponse;

/**
 *  Integration tests for the words endpoint
 */
public class WordsTest {

    @ClassRule
    public static EnvironmentRule env = new EnvironmentRule(true);
    private static String authorization,wordlistUri,_1stWordUri;

    @BeforeClass
    public static void setupClass() {
        RestAssured.baseURI = env.getWordlistHostAndPort();
    }


    @Before
    public void setup() {
        // registering a new user and his single wordlist
        var registration = TestUtils.createRandomUser(env.getSignUpEndpoint());
        authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), env.getSignInEndpoint());

        var words = List.of(new Word("scrambled"),new Word("behind the ball 8"),new Word("flake"));
        var wordlist = new Wordlist("wordlist test","name of the wordlist","en", words);


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
        String _1stWordId = given()
                        .header("authorization", "bearer " + authorization)
                    .when()
                        .get(wordlistUri+"/words")
                    .then()
                        .statusCode(200)
                    .extract()
                        .body()
                        .path("words[0]._id");

        assertThat(_1stWordId, not(emptyOrNullString()));        
        _1stWordUri = wordlistUri + "/words/" + _1stWordId;
    }

    @Test
    public void shouldbeAbleToReadWordsWordlistsInSortedOrder() {
        
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .get(wordlistUri + "/words")
        .then()
            .statusCode(200)
            .body("words.size()",is(3))   
            .body("words.name",hasItems("behind the ball 8","flake", "scrambled"));      
    }

    @Test(timeout = 5000)
    public void shoudBeAbleToAddANewWord() {

        // acting
        given()
            .header("authorization", "bearer " + authorization)
            .contentType(ContentType.JSON)
            .body(new Word("thing"))
        .when()
            .post(wordlistUri + "/words")
        .then()
            .statusCode(201)
            .header("link", startsWith(wordlistUri + "/words"));

        // asserting
        
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .get(wordlistUri + "/words")
        .then()
            .statusCode(200)
            .body("words.size()",is(4))   
            .body("words.name",hasItems("behind the ball 8","flake","scrambled","thing"));    
        
    }

    @Test(timeout = 5000)
    public void userShouldBeAbleToPatchWordsFromHisWordlists() {

        // acting
        given()
            .header("authorization", "bearer " + authorization)
            .contentType(ContentType.JSON)
            .body(new Word("discombobulate"))
        .when()
            .patch(_1stWordUri)
        .then()
            .statusCode(204);

        // asserting
        
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .get(_1stWordUri)
        .then()
            .statusCode(200)
            .body("_id", notNullValue())
            .body("name",is("discombobulate"));
        
    }

    @Test(timeout=5000)
    public void shouldReturnStatus404AfterTryingDeleteInexistingWord() {
        given()
            .header("authorization", "bearer " + authorization)
            .contentType(ContentType.JSON)
        .when()
            .delete(wordlistUri + "/words/000000000000")
        .then()
            .statusCode(404);        
    }


    @Test(timeout=5000)
    public void shouldReturnStatus204DeleteWord() {
        given()
            .header("authorization", "bearer " + authorization)
            .contentType(ContentType.JSON)
        .when()
            .delete(_1stWordUri)
        .then()
            .statusCode(204);        
    }    

    
}