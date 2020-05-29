package com.decorebator.integration.wordlists;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.matchesRegex;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import com.decorebator.beans.Word;
import com.decorebator.beans.Wordlist;
import com.decorebator.integration.EnvironmentRule;
import com.decorebator.integration.TestUtils;

import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;

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


    @ClassRule
    public static EnvironmentRule environment = new EnvironmentRule(true);
    private static URL signUpEndpoint;
    private static URL signInEndpoint;    
        
    @BeforeClass
    public static void setup() throws MalformedURLException {
        RestAssured.baseURI = environment.getWordlistEndpoint().toString();
        signUpEndpoint = environment.getSignUpEndpoint();
        signInEndpoint = environment.getSignInEndpoint();
    }
	    

    @Test
    public void shouldNotBeAbleToCreateWordlistFromEmptyBody() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        
        given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
        .when()
            .post("/")
        .then()
            .statusCode(400)
            .contentType(ContentType.JSON)
            .body("name.kind",is("required"))
            .body("language.kind",is("required"));

    }    

    @Test
    public void registeredUserShouldBeAbleToCreateWordlistWithoutWords() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        var wordlist = new Wordlist("wordlist test","name of the wordlist","pt-br", Collections.emptyList());
        
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
        var wordlist = new Wordlist("wordlist test","name of the wordlist","pt-br", words);

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
            .get(resourceId + "/words")
        .then()
            .statusCode(200)
            .body("words.size()",is(3))
            .body("words.name",hasItems("word","straightforward","tight"));

    }

    @Test
    public void shouldFilterOutEmptyAndWordsOnlyWithNumbers() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        
        var words = List.of(new Word(""),new Word("\t"),new Word("   "),new Word("acceptable1"),new Word("1223444333"));

        String resourceUri = TestUtils.createRandomWordlist(authorization, environment.getWordlistEndpoint(), words);
        String resourceId = resourceUri.substring("/wordlists".length());
    
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .get(resourceId + "/words")
        .then()
            .statusCode(200)
            .body("words.size()",is(1))
            .body("words.name",hasItems("acceptable1"));

    }    

    @Test
    public void shouldFilterOutUnwantedChars() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        
        var words = List.of(new Word("[[](),;:.\"?!_=&"),new Word("out? of the blue"),new Word("123too4$5#6"),new Word("<font color=\"#f00\">xpto</font>"));

        String resourceUri = TestUtils.createRandomWordlist(authorization, environment.getWordlistEndpoint(), words);
        String resourceId = resourceUri.substring("/wordlists".length());
    
        given()
            .header("authorization", "bearer " + authorization)
        .when()
            .get(resourceId + "/words")
        .then()
            .statusCode(200)
            .body("words.size()",is(3))
            .body("words.name",hasItems("out of the blue","123too456","xpto"));

    }      

    @Test
    public void userShouldBeAbleToCreateWordlistsOnlyWithBrandNewWords() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);

        var words = List.of(new Word("law"),new Word("Rollin'"),new Word("cow's milk"));
        var wordlist1 = new Wordlist("first wordlist","dd","en", words);


        given()
            .contentType(ContentType.JSON)
            .header("authorization","bearer " + authorization)
            .body(wordlist1)
        .when()
            .post("/")
        .then()
            .statusCode(201);

        // sending all words from the previous wordlist, upper cased
        var words2 = new LinkedList<>(words.stream().map(Word::getName).map(String::toUpperCase).map(Word::new).collect(Collectors.toList()));
        words2.addAll(List.of(new Word("single"), new Word("ballpark")));

        var wordlist2 = new Wordlist("second wordlist","xpto","en", words2,true);

        ExtractableResponse response = given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(wordlist2)
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
            .get(resourceId+"/words")
        .then()
            .statusCode(200)
            .body("words.size()",is(2))
            .body("words.name",hasItems("single","ballpark"));        
        

        
    }


    @Test
    public void registeredUserShouldBeAbleToPatchHisOwnWordlists() {
        var registration = TestUtils.createRandomUser(signUpEndpoint);
        var authorization = TestUtils.signIn(registration.getLogin(), registration.getPassword(), signInEndpoint);
        
        var wordlist = new Wordlist("wordlist description","wrong name","en", Collections.emptyList());

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
        
        var wordlist = new Wordlist("wordlist description","wordlist to be deleted","en", Collections.emptyList());

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