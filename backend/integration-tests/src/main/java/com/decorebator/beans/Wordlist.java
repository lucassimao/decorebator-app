package com.decorebator.beans;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Wordlist
 */
public class Wordlist {

    String owner, description, name, language;
    List<Word> words;


    public Wordlist() {
    }

    public Wordlist(String owner, String description, String name, String language, List<Word> words) {
        this.owner = owner;
        this.description = description;
        this.name = name;
        this.language = language;
        this.words = words;
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

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Wordlist)) {
            return false;
        }
        Wordlist wordlist = (Wordlist) o;
        return Objects.equals(owner, wordlist.owner) && Objects.equals(description, wordlist.description) && Objects.equals(name, wordlist.name) && Objects.equals(language, wordlist.language) && Objects.equals(words, wordlist.words);
    }

    @Override
    public int hashCode() {
        return Objects.hash(owner, description, name, language, words);
    }

    @Override
    public String toString() {
        return "{" +
            " owner='" + getOwner() + "'" +
            ", description='" + getDescription() + "'" +
            ", name='" + getName() + "'" +
            ", language='" + getLanguage() + "'" +
            ", words='" + getWords() + "'" +
            "}";
    }



}