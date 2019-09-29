package com.decorebator.beans;

/**
 * UserRegistration
 */
public class UserRegistration {

    private String login, name, password, country;

    

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public UserRegistration(String login, String name, String password, String country) {
		this.login = login;
		this.name = name;
		this.password = password;
		this.country = country;
	}

    

    
}