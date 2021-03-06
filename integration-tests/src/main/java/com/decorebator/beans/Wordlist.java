package com.decorebator.beans;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Wordlist
 */
public class Wordlist {

    String owner, description, name, language, avatarColor;
    List<Word> words;
    boolean onlyNewWords, isPrivate;


    public Wordlist() {
        this.onlyNewWords=false;
    }


    public Wordlist(String description, String name, String language, List<Word> words) {
        this(description,name,language,words,false);
    }      

    public Wordlist(String description, String name, String language, List<Word> words,boolean onlyNewWords) {
        this.owner = null;
        this.description = description;
        this.name = name;
        this.language = language;
        this.words = words;
        this.onlyNewWords = onlyNewWords;
        this.isPrivate=true;
        this.avatarColor="#fff";
    }    

    public String getOwner() {
        return this.owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<Word> getWords() {
        return this.words;
    }

    public void setWords(List<Word> words) {
        this.words = words;
    }

    public Wordlist owner(String owner) {
        this.owner = owner;
        return this;
    }

    public Wordlist description(String description) {
        this.description = description;
        return this;
    }

    public Wordlist name(String name) {
        this.name = name;
        return this;
    }

    public Wordlist language(String language) {
        this.language = language;
        return this;
    }

    public Wordlist words(List<Word> words) {
        this.words = words;
        return this;
    }

    /**
     * @return the onlyNewWords
     */
    @JsonProperty("onlyNewWords")
    public boolean isOnlyNewWords() {
        return onlyNewWords;
    }

    /**
     * @param onlyNewWords the onlyNewWords to set
     */
    public void setOnlyNewWords(boolean onlyNewWords) {
        this.onlyNewWords = onlyNewWords;
    }

    public String getAvatarColor() {
        return avatarColor;
    }

    @JsonProperty("isPrivate")
    public boolean isPrivate() {
        return isPrivate;
    }

    public void setAvatarColor(String avatarColor) {
        this.avatarColor = avatarColor;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }


}