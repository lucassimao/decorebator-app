package com.decorebator.integration;

import java.io.File;
import java.net.URL;

import org.junit.rules.ExternalResource;
import org.junit.runner.Description;
import org.junit.runners.model.Statement;
import org.testcontainers.containers.DockerComposeContainer;
import org.testcontainers.containers.wait.strategy.Wait;

/**
 * EnvironmentRule
 */
public class EnvironmentRule extends ExternalResource {

    @java.lang.SuppressWarnings("all")
    private DockerComposeContainer env;
            
	private String authHost;
	private Integer authPort;
	private URL signInEndpoint;
	private URL signUpEndpoint;
	private String wordlistHost;
	private Integer wordlistPort;
    private URL wordlistEndpoint;
	private boolean clearDbBetweenMethods;
	private String wordlistHostAndPort;    
    

    public EnvironmentRule(boolean clearDbBetweenMethods){
        this.clearDbBetweenMethods = clearDbBetweenMethods;
    }

    @Override
    @java.lang.SuppressWarnings("all")
    protected void before() throws Throwable {
        super.before();

        this.env  = new DockerComposeContainer(new File(TestUtils.DOCKER_COMPOSER_YML))
                    .withLocalCompose(true)
                    .withExposedService("wordlists", 3000, Wait.forListeningPort())
                    .withExposedService("db", 27017, Wait.forListeningPort())
                    .withExposedService("auth", 3000, Wait.forListeningPort());

        env.start();
        authHost = env.getServiceHost("auth", 3000);
        authPort = env.getServicePort("auth", 3000);
        signInEndpoint = new URL("http",authHost,authPort,"/signin");
        signUpEndpoint = new URL("http",authHost,authPort,"/signup");

        wordlistHost = env.getServiceHost("wordlists", 3000);
        wordlistPort = env.getServicePort("wordlists", 3000);    
        wordlistEndpoint = new URL("http",wordlistHost,wordlistPort,"/wordlists");
        wordlistHostAndPort = "http://" + wordlistHost + ":" +wordlistPort;
    }

    @Override
    public Statement apply(Statement base, Description description) {
        if (this.clearDbBetweenMethods && this.env != null){
            String mongodbHost = env.getServiceHost("db", 27017);
            int mongodbPort = env.getServicePort("db", 27017);
            TestUtils.clearMongoDb(mongodbHost,mongodbPort);
        }
        return super.apply(base, description);
    }


    @Override
    protected void after() {
        super.after();
        env.stop();
    }

	public String getAuthHost() {
		return authHost;
	}

	public Integer getAuthPort() {
		return authPort;
	}

	public URL getSignInEndpoint() {
		return signInEndpoint;
	}

	public URL getSignUpEndpoint() {
		return signUpEndpoint;
	}

	public String getWordlistHost() {
		return wordlistHost;
	}

	public Integer getWordlistPort() {
		return wordlistPort;
	}

	public URL getWordlistEndpoint() {
		return wordlistEndpoint;
    }
    
    public String getWordlistHostAndPort() {
        return wordlistHostAndPort;
    }

}