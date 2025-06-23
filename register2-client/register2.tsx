"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/RegisterPage2.module.css";
import {addContactAndCompleteProfile} from "./actions";

const ClientSignup2: NextPage = () => {
  const [phone, setPhone] = useState("");
  const [countryCode] = useState("+63");
  const [codeSent, setCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isPhoneValid = phone.match(/^\d{10}$/);
  const isOtpValid = otp.every((digit) => digit.match(/^\d$/));
  const isNextEnabled = codeSent && isOtpValid;

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const handleSendCode = async () => {
    setErrorMessage("");
    try {
      if (!isPhoneValid)
        throw new Error("Enter a valid 10-digit phone number.");
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCodeSent(true);
      setTimer(30);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (codeSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [codeSent, timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/, "");
    setOtp(newOtp);
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");
      if (!isOtpValid) throw new Error("Please enter a valid 4-digit code");
      setLoading(true);
    try{
      const formData = new FormData();
      formData.append('contact_number', countryCode + phone);
      await addContactAndCompleteProfile(formData);

    } catch (error: any) {
      setErrorMessage(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.clientSignup2}>
      <div className={styles.headerNav}>
        <Image
          className={styles.serveaseLogoAlbumCover3}
          width={40}
          height={40}
          sizes="100vw"
          alt=""
          src="/servease logo.svg"
        />
        <div className={styles.links}>
          <div className={styles.home}>Home</div>
          <div className={styles.webDesigns}>Web designs</div>
          <div className={styles.webDesigns}>Mobile designs</div>
          <div className={styles.webDesigns}>Design principles</div>
          <div className={styles.webDesigns}>Illustrations</div>
        </div>
        <div className={styles.loginSignUp}>
          <div className={styles.dropdown} />
          <div className={styles.button} />
          <div className={styles.button} />
        </div>
        <div className={styles.divider} />
      </div>
      <div className={styles.joinUs}>
        <div className={styles.conten}>
          <div className={styles.joinUsParent}>
            <div className={styles.joinUs1}>Join us</div>
            <div className={styles.signUpAnd}>
              Sign up and get connected with trusted professionals.
            </div>
          </div>
          <div className={styles.stepper}>
            <div className={styles.groupParent}>
              <div className={styles.bgParent}>
                <div className={styles.bg} />
                <div className={styles.div}>1</div>
              </div>
              <div className={styles.profile}>Profile</div>
            </div>
            <div className={styles.stepperChild} />
            <div className={styles.groupContainer}>
              <div className={styles.bgParent}>
                <div className={styles.bg} />
                <div className={styles.div}>2</div>
              </div>
              <div className={styles.profile}>Contacts</div>
            </div>
            <div className={styles.stepperChild} />
            <div className={styles.frameDiv}>
              <div className={styles.bgParent}>
                <div className={styles.bg} />
                <div className={styles.div}>3</div>
              </div>
              <div className={styles.profile}>Login</div>
            </div>
          </div>
          <div className={styles.frameParent}>
            <div className={styles.frameWrapper}>
              <div className={styles.frameContainer}>
                <div className={styles.numberWrapper}>
                  <div className={styles.number}>
                    <div className={styles.groupDiv}>
                      <div className={styles.bg3} />
                      <div className={styles.div3}>1</div>
                    </div>
                    <div className={styles.contactInformation}>Profile</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.frameGroup}>
              <div className={styles.frameParent1}>
                <div className={styles.numberParent}>
                  <div className={styles.number1}>
                    <div className={styles.groupDiv}>
                      <div className={styles.bg3} />
                      <div className={styles.div3}>2</div>
                    </div>
                    <div className={styles.contactInformation}>
                      Contact Information
                    </div>
                  </div>
                  <div className={styles.provideYourPhone}>
                    Provide your phone number so we can confirm your bookings
                    and verify your account.
                  </div>
                  <div className={styles.allFieldsRequired}>
                    *All fields required unless noted.
                  </div>
                </div>
                <div className={styles.cardInput}>
                  <div className={styles.labelParent}>
                    <div className={styles.label}>*Phone number</div>
                    <div className={styles.passwordHideSee}>
                      <div className={styles.icon}>
                        <Image
                          className={styles.iconChild}
                          width={18.2}
                          height={16}
                          sizes="100vw"
                          alt=""
                          src="/Group 1.svg"
                        />
                      </div>
                      <div className={styles.hide}>Hide</div>
                    </div>
                  </div>
                  <div className={styles.inputButton}>
                    <div className={styles.input}>
                      <div className={styles.select}>
                        <Image
                          className={styles.phPhilippinesIcon}
                          width={33}
                          height={24}
                          sizes="100vw"
                          alt=""
                          src="/ph Philippines.svg"
                        />
                      </div>
                      <div className={styles.webDesigns}>({countryCode})</div>
                      <input
                        type="text"
                        placeholder="Enter 10-digit number"
                        value={phone}
                        maxLength={10}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, ""))
                        }
                        className={styles.div6}
                        style={{
                          border: "none",
                          outline: "none",
                          background: "transparent",
                        }}
                      />
                    </div>
                    <div
                      className={styles.button2}
                      onClick={handleSendCode}
                      style={{
                        backgroundColor: isPhoneValid ? "#a68465" : "#ccc",
                        cursor:
                          isPhoneValid && !loading ? "pointer" : "not-allowed",
                      }}
                    >
                      <div className={styles.sendCode}>
                        {loading ? "Sending..." : "Send Code"}
                      </div>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div
                    style={{
                      color: "red",
                      marginTop: "10px",
                      fontSize: "14px",
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                <Image
                  className={styles.frameChild}
                  width={611}
                  height={1.5}
                  sizes="100vw"
                  alt=""
                  src="/Line 15.svg"
                />
                <div className={styles.form}>
                  <div className={styles.resendCode}>
                    <div className={styles.time}>
                      <Image
                        className={styles.outlineTimeClockCircle}
                        width={20}
                        height={20}
                        sizes="100vw"
                        alt=""
                        src="/Outline / Time / Clock Circle.svg"
                      />
                      <div className={styles.div7}>
                        00 : {timer.toString().padStart(2, "0")}
                      </div>
                    </div>
                    <div
                      className={styles.resendCode1}
                      style={{
                        opacity: timer === 0 ? 1 : 0.4,
                        cursor: timer === 0 ? "pointer" : "not-allowed",
                      }}
                      onClick={() => timer === 0 && handleSendCode()}
                    >
                      Resend Code
                    </div>
                  </div>
                  <div className={styles.inputs}>
                    <div className={styles.list}>
                      <div
                        className={styles.input1}
                        style={{ position: "relative" }}
                      >
                        <input
                          ref={(el) => {
                            if (el) {
                              otpRefs.current[0] = el;
                            }
                          }}
                          type="text"
                          value={otp[0]}
                          onChange={(e) => handleOtpChange(e.target.value, 0)}
                          maxLength={1}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
                            fontSize: "24px",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div
                        className={styles.input2}
                        style={{ position: "relative" }}
                      >
                        <input
                          ref={(el) => {
                            if (el) {
                              otpRefs.current[1] = el;
                            }
                          }}
                          type="text"
                          value={otp[1]}
                          onChange={(e) => handleOtpChange(e.target.value, 1)}
                          maxLength={1}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
                            fontSize: "24px",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div
                        className={styles.input2}
                        style={{ position: "relative" }}
                      >
                        <input
                          ref={(el) => {
                            if (el) {
                              otpRefs.current[2] = el;
                            }
                          }}
                          type="text"
                          value={otp[2]}
                          onChange={(e) => handleOtpChange(e.target.value, 2)}
                          maxLength={1}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
                            fontSize: "24px",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div
                        className={styles.input2}
                        style={{ position: "relative" }}
                      >
                        <input
                          ref={(el) => {
                            if (el) {
                              otpRefs.current[3] = el;
                            }
                          }}
                          type="text"
                          value={otp[3]}
                          onChange={(e) => handleOtpChange(e.target.value, 3)}
                          maxLength={1}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
                            fontSize: "24px",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.button3}>
                <div
                  className={styles.signUpWrapper}
                  onClick={isNextEnabled ? handleSubmit : undefined}
                  style={{
                    backgroundColor: isNextEnabled ? "#a68465" : "#ccc",
                    cursor: isNextEnabled ? "pointer" : "not-allowed",
                  }}
                >
                  <div
                    className={styles.webDesigns}
                    style={{ color: isNextEnabled ? "#fff" : "#666" }}
                  >
                    {loading ? "Verifying..." : "Next"}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.frameWrapper}>
              <div className={styles.frameContainer}>
                <div className={styles.numberWrapper}>
                  <div className={styles.number}>
                    <div className={styles.groupDiv}>
                      <div className={styles.bg3} />
                      <div className={styles.div3}>3</div>
                    </div>
                    <div className={styles.contactInformation}>Login</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image
        className={styles.outlineArrowsArrowLeft}
        width={24}
        height={24}
        sizes="100vw"
        alt=""
        src="/Arrow Left.svg"
        onClick={handleBack}
        style={{ cursor: "pointer" }}
      />
      <div
        className={styles.back}
        onClick={handleBack}
        style={{ cursor: "pointer" }}
      >
        Back
      </div>
    </div>
  );
};

export default ClientSignup2;
