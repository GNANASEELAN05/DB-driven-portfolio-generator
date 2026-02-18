package com.portfolio.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "resume_files",
        indexes = {
                @Index(name = "idx_resume_owner", columnList = "ownerUsername"),
                @Index(name = "idx_resume_primary", columnList = "ownerUsername,primaryResume")
        }
)
public class ResumeFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Multi-tenant key
     */
    @Column(nullable = false)
    private String ownerUsername;

    private String filename;
    private String contentType;

    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(columnDefinition = "bytea")
    private byte[] data;

    // ✅ primary resume for viewer
    private boolean primaryResume = false;

    // ✅ upload date/time
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public Long getId() { return id; }

    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public byte[] getData() { return data; }
    public void setData(byte[] data) { this.data = data; }

    public boolean isPrimaryResume() { return primaryResume; }
    public void setPrimaryResume(boolean primaryResume) { this.primaryResume = primaryResume; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
