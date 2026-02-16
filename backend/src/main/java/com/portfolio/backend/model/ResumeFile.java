package com.portfolio.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_files")
public class ResumeFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    private String contentType;

    /*
     ⭐⭐⭐ MOST IMPORTANT FIX ⭐⭐⭐
     Correct mapping for PostgreSQL BYTEA in Hibernate 6/7
     REMOVE columnDefinition="BYTEA"
    */
    @Lob
    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "data", nullable = false)
    private byte[] data;

    // must match repository method
    @Column(name = "primary_resume")
    private boolean primaryResume = false;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public ResumeFile() {}

    public Long getId() {
        return id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public boolean isPrimaryResume() {
        return primaryResume;
    }

    public void setPrimaryResume(boolean primaryResume) {
        this.primaryResume = primaryResume;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
