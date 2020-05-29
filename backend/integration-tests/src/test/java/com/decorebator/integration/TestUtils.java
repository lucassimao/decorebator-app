package com.decorebator.integration;

import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import com.decorebator.beans.UserLogin;
import com.decorebator.beans.UserRegistration;
import com.decorebator.beans.Word;
import com.decorebator.beans.Wordlist;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import org.bson.BsonDocument;

import io.restassured.http.ContentType;
import io.restassured.response.Response;

import static io.restassured.RestAssured.*;


/**
 * TestUtils
 */
public class TestUtils {

    public final static String DOCKER_COMPOSER_YML = "../docker-compose.yml";

    public static void clearMongoDb(String mongodbHost,int mongodbPort) {
        String uri = String.format("mongodb://%s:%d",mongodbHost,mongodbPort);
        MongoClient mongoClient = MongoClients.create(uri);
        MongoDatabase db = mongoClient.getDatabase("decorebator");

        var collection = db.getCollection("users");
        collection.deleteMany(new BsonDocument());

        collection = db.getCollection("wordlists");
        collection.deleteMany(new BsonDocument());

        mongoClient.close();
    }

	public static String createRandomWordlist(URL signUpEndpoint,URL signInEndpoint, URL wordlistsEndpoint) {
        var randomUser = createRandomUser(signUpEndpoint);
        var authorization = signIn(randomUser.getLogin(), randomUser.getPassword(), signInEndpoint);

        return createRandomWordlist(authorization, wordlistsEndpoint);
    }

	public static String createRandomWordlist(String authorization, URL wordlistsEndpoint,List<Word> words) {
        var wordlist = new Wordlist("Random wordlist created by TesUtils", "Random wordlist", "pt-br", words);

        Response response = given()
            .contentType(ContentType.JSON)
            .header("authorization", "bearer " + authorization)
            .body(wordlist)
        .when()
            .post(wordlistsEndpoint)
        .thenReturn();

        if (response.statusCode() == 201){
            return response.header("link");
        } else {
            throw new IllegalStateException(response.getStatusLine());
        }
    }

	public static String createRandomWordlist(String authorization, URL wordlistsEndpoint) {
        return createRandomWordlist(authorization, wordlistsEndpoint, Collections.emptyList());
    }    

    
	public static UserRegistration createRandomUser(URL signUpEndpoint) {
        var random = new Random(System.currentTimeMillis());
        var userRegistration  = new UserRegistration("user"+ random.nextInt() + "@gmail.com", "Random user",""+System.currentTimeMillis(),"BR" );
        
        given()
            .contentType(ContentType.JSON)
            .body(userRegistration)
        .when()
            .post(signUpEndpoint)
        .then()
            .statusCode(200);  

		return userRegistration;
    }    
    

	public static String signIn(String login, String password, URL signinEndpoint) {
        var userLogin  = new UserLogin(login,password);
        
        Response response =  given().contentType(ContentType.JSON)
                                .body(userLogin).when().post(signinEndpoint).thenReturn();
        
        if (response.statusCode() == 200){
            return response.header("authorization");
        } else 
            throw new IllegalStateException(response.getStatusCode() + ": " + response.getStatusLine());
	}     
}