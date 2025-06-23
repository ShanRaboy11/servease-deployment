"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useState, useRef } from "react";
import styles from "../styles/register-facility-2.module.css";

const FacilitySignup2: NextPage = () => {
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    string | null
  >(null);
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: string | null;
  }>({
    businessRegistration: null,
    governmentId: null,
    facilityPhotos: null,
    serviceLicenses: null,
    proofOfAddress: null,
    taxDocuments: null,
    insuranceCompliance: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showError, setShowError] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const documentTypes = [
    { key: "businessRegistration", label: "Business Registration" },
    { key: "governmentId", label: "Valid Government-issued ID" },
    { key: "facilityPhotos", label: "Facility Photos" },
    { key: "serviceLicenses", label: "Service Licenses / Certifications" },
    { key: "proofOfAddress", label: "Proof of Address" },
    { key: "taxDocuments", label: "Tax Documents" },
    { key: "insuranceCompliance", label: "Insurance or Safety Compliance" },
  ];

  const handleDocumentClick = (docType: string) => {
    setSelectedDocumentType(docType);
    setShowError(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedDocumentType) {
      setUploadedFiles((prev) => {
        const updated = {
          ...prev,
          [selectedDocumentType]: file.name,
        };
        if (Object.values(updated).every((name) => name)) {
          setShowError(false);
        }
        return updated;
      });
      setSelectedDocumentType(null);
    }
  };

  const allFilesUploaded = Object.values(uploadedFiles).every(
    (fileName) => fileName !== null
  );

  const handleNextClick = () => {
    setButtonClicked(true);
    setTimeout(() => setButtonClicked(false), 200);

    if (!allFilesUploaded) {
      setShowError(true);
    } else {
      setShowError(false);
      console.log("All files uploaded, proceeding to next step");
    }
  };

  return (
    <div className={styles.facilitySignup2}>
      <div className={styles.header}>
        <Image
          className={styles.regislogoIcon}
          width={40}
          height={40}
          sizes="100vw"
          alt=""
          src="/regisLogo.svg"
        />
        <div className={styles.divider} />
        <Image
          className={styles.arrowIcon}
          width={24}
          height={24}
          sizes="100vw"
          alt=""
          src="/arrow.svg"
        />
        <div className={styles.back}>Back</div>
      </div>
      <div className={styles.register}>
        <div className={styles.content}>
          <div className={styles.title}>
            <div className={styles.joinUs}>Join us</div>
            <div className={styles.signUpAnd}>
              Sign up and get connected with trusted professionals.
            </div>
          </div>
          <div className={styles.nav}>
            <div className={styles.profile}>
              <div className={styles.number}>
                <div className={styles.bg} />
                <div className={styles.div}>1</div>
              </div>
              <div className={styles.profile1}>Profile</div>
            </div>
            <div className={styles.line} />
            <div className={styles.documents}>
              <div className={styles.number}>
                <div className={styles.bg} />
                <div className={styles.div}>2</div>
              </div>
              <div className={styles.profile1}>Documents</div>
            </div>
            <div className={styles.line} />
            <div className={styles.contacts}>
              <div className={styles.number}>
                <div className={styles.bg} />
                <div className={styles.div}>3</div>
              </div>
              <div className={styles.profile1}>Contacts</div>
            </div>
            <div className={styles.line} />
            <div className={styles.login}>
              <div className={styles.number}>
                <div className={styles.bg} />
                <div className={styles.div}>4</div>
              </div>
              <div className={styles.profile1}>Login</div>
            </div>
          </div>
          <div className={styles.navcontents}>
            <div className={styles.contactInfo}>
              <div className={styles.profileDescrip}>
                <div className={styles.profileContent}>
                  <div className={styles.profileTitle}>
                    <div className={styles.docuncheckedIcon}>
                      <div className={styles.bg4} />
                      <div className={styles.div4}>1</div>
                    </div>
                    <div className={styles.contactInformation}>Profile</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.documents2}>
              <div className={styles.documentsDescrip}>
                <div className={styles.documentsDescrip1}>
                  <div className={styles.documentsTitle}>
                    <div className={styles.docuncheckedIcon}>
                      <div className={styles.bg4} />
                      <div className={styles.div4}>2</div>
                    </div>
                    <div className={styles.contactInformation}>Documents</div>
                  </div>
                  <div className={styles.submitDocumentsNeeded}>
                    Submit documents needed for verification. All information is
                    handled securely and used solely to confirm your
                    eligibility.
                  </div>
                  <div className={styles.allFieldsRequired}>
                    All fields required unless noted.
                  </div>
                </div>
              </div>
              <div className={styles.uploadFiles}>
                <b className={styles.uploadFilesText}>Upload files</b>
                {selectedDocumentType && (
                  <>
                    <div
                      className={styles.uploadPhoto}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className={styles.upload}>
                        <Image
                          className={styles.fileAddIcon}
                          width={30}
                          height={30}
                          sizes="100vw"
                          alt=""
                          src="/file-add.svg"
                        />
                        <div className={styles.clickToUpload}>
                          {uploadedFiles[selectedDocumentType] ??
                            "Click to upload"}
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        id="fileInput"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                    <div className={styles.documentsType}>
                      <div className={styles.pdf}>
                        <div className={styles.pdf1}>PDF</div>
                      </div>
                      <div className={styles.pdf}>
                        <div className={styles.pdf1}>PNG</div>
                      </div>
                      <div className={styles.pdf}>
                        <div className={styles.pdf1}>JPG</div>
                      </div>
                      <div className={styles.pdf}>
                        <div className={styles.pdf1}>JPEG</div>
                      </div>
                      <div className={styles.pdf6}>
                        <div className={styles.pdf1}>{`> 10 MB`}</div>
                      </div>
                    </div>
                  </>
                )}
                {documentTypes.map((docType) => {
                  const isSelected = selectedDocumentType === docType.key;
                  return (
                    <div
                      key={docType.key}
                      className={`${styles.businessRegis} ${
                        isSelected ? styles.selected : ""
                      } ${
                        showError && !uploadedFiles[docType.key]
                          ? styles.uploadErrorBox
                          : ""
                      }`}
                      onClick={() => handleDocumentClick(docType.key)}
                    >
                      <div className={styles.document1}>
                        <b className={styles.uploadFilesText}>
                          {docType.label}
                        </b>
                        <div
                          className={
                            uploadedFiles[docType.key]
                              ? styles.uploadComplete
                              : showError
                              ? styles.uploadIncompleteError
                              : styles.uploadComplete
                          }
                        >
                          {uploadedFiles[docType.key]
                            ? "Upload complete"
                            : showError
                            ? "Upload incomplete"
                            : "Upload"}
                        </div>
                      </div>
                      <Image
                        className={styles.docuncheckedIcon}
                        width={24}
                        height={24}
                        sizes="100vw"
                        alt=""
                        src={
                          uploadedFiles[docType.key]
                            ? "/docuChecked.svg"
                            : "/docUnchecked.svg"
                        }
                      />
                    </div>
                  );
                })}
              </div>
              <div className={styles.buttonSection}>
                <div
                  className={`${styles.errorbox} ${
                    showError ? styles.visible : styles.hidden
                  }`}
                >
                  <div className={styles.errorMessage}>
                    Please upload all required documents before continuing.
                  </div>
                </div>
                <div
                  className={`${styles.buttoncontainer} ${
                    allFilesUploaded ? styles.buttoncontainerActive : ""
                  } ${buttonClicked ? styles.clicked : ""}`}
                  onClick={handleNextClick}
                >
                  <div className={styles.next}>
                    <div className={styles.uploadFilesText}>Next</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.profileDescrip}>
                <div className={styles.profileContent}>
                  <div className={styles.profileTitle}>
                    <div className={styles.docuncheckedIcon}>
                      <div className={styles.bg4} />
                      <div className={styles.div4}>3</div>
                    </div>
                    <div className={styles.contactInformation}>
                      Contact Information
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.profileDescrip}>
                <div className={styles.profileContent}>
                  <div className={styles.profileTitle}>
                    <div className={styles.docuncheckedIcon}>
                      <div className={styles.bg4} />
                      <div className={styles.div4}>4</div>
                    </div>
                    <div className={styles.contactInformation}>Login</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitySignup2;
