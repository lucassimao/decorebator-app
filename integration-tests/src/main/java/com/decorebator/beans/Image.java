package com.decorebator.beans;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

/**
 * Image
 */
public class Image {

    private String fileName, base64Image, description;


    public Image(File file, String description) throws IOException {
        this.fileName = file.getName();
        this.base64Image = Base64.getEncoder().encodeToString(Files.readAllBytes(file.toPath()));
        this.description = description;
    }
    

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getBase64Image() {
		return base64Image;
	}

	public void setBase64Image(String base64Image) {
		this.base64Image = base64Image;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}


}