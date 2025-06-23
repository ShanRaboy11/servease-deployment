"use client";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import styles from "../styles/RegisterFacilityPage2copy.module.css";
import { facilityProfile } from "./actionspage";
import Link from "next/link";

type Props = {
  onNext: () => void;
};

export default function FacilitySignup2({ onNext }: Props) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);
  const [showErrorBox, setShowErrorBox] = useState(false);
  const [showRowError, setShowRowError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  const [ownername, setOwnerName] = useState("");
  const [facilityname, setFacilityName] = useState("");
  const [facilitylocation, setFacilityLocation] = useState("");

  const router = useRouter();

  const Categories = [
    {
      value: "01",
      label: "Personal Care & Beauty Services",
      subcategories: [
        "Barbershops",
        "Hair Salons",
        "Nail Salons",
        "Spa & Massage Centers",
        "Tattoo and Piercing Parlors",
      ],
    },
    {
      value: "02",
      label: "Health & Medical Services",
      subcategories: [
        "Animal Clinics",
        "Dentists",
        "Dermatologists",
        "Hospitals",
        "Laboratories",
        "Pharmacies",
        "Psychologists",
      ],
    },
    {
      value: "03",
      label: "Fitness & Sports Services",
      subcategories: ["Dance Studios", "Gyms", "Sports Centers"],
    },
    {
      value: "04",
      label: "Education & Tutoring Services",
      subcategories: [
        "Schools (Daycare, Nursery, Elementary, High Schools, Colleges)",
        "Tutoring Centers",
      ],
    },
    {
      value: "05",
      label: "Repair & Technical Services",
      subcategories: [
        "Appliance Repair",
        "Car Wash",
        "Car/Motorcycle Repair Shops",
        "Electronics Repair",
      ],
    },
    {
      value: "06",
      label: "Food & Beverages Services",
      subcategories: [
        "Bakeries",
        "Bars",
        "Cafes & Coffee Shops",
        "Mini Mart",
        "Restaurants",
        "Supermarkets / Grocery Stores",
      ],
    },
    {
      value: "07",
      label: "Miscellaneous Services",
      subcategories: [
        "Funeral Homes",
        "Hotels",
        "Laundry Shops",
        "Tailoring Services",
      ],
    },
  ];

  const handleCategorySelect = (category: { value: string; label: string }) => {
    setSelectedCategory(category.label);
    setSelectedSubcategory("");
    setIsCategoryOpen(false);
  };

  const selectedCategoryObject = Categories.find(
    (c) => c.label === selectedCategory
  );
  const subcategories = selectedCategoryObject?.subcategories || [];

  //WORKING DAYS
  const workingDaysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prevDays) => {
      let updatedDays;
      if (prevDays.includes(day)) {
        updatedDays = prevDays.filter((d) => d !== day);
      } else {
        updatedDays = [...prevDays, day];
      }

      if (updatedDays.length > 0) {
        setShowRowError(false);
      }

      return updatedDays;
    });
  };

  const getLabel = () => {
    if (selectedDays.length === 7) return "Everyday";
    if (selectedDays.length === 0) return "None selected";
    return `Selected: ${selectedDays.join(", ")}`;
  };

  const isDaySelected = (day: string) => selectedDays.includes(day);

  //TIMERPICKER

  const generateTimeOptions = () => {
    const times: string[] = [];

    const periods = ["AM", "PM"];

    periods.forEach((period) => {
      for (let hour = 1; hour <= 12; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
          const h = hour.toString().padStart(2, "0");
          const m = minute.toString().padStart(2, "0");
          times.push(`${h}:${m} ${period}`);
        }
      }
    });

    return times;
  };

  const handleTimeSelect = (time: string, isStart: boolean) => {
    if (isStart) {
      setSelectedStartTime(time);
      setIsStartTimeOpen(false);
    } else {
      setSelectedEndTime(time);
      setIsEndTimeOpen(false);
    }
  };

  //ERRORING
  const [errors, setErrors] = useState({
    ownername: false,
    facilityname: false,
    facilitylocation: false,
    selectedCategory: false,
    selectedSubcategory: false,
    selectedStartTime: false,
    selectedEndTime: false,
  });

  const noDaysSelected = selectedDays.length === 0;

  const fieldErrors = {
    ownername: !ownername.trim(),
    facilityname: !facilityname.trim(),
    facilitylocation: !facilitylocation.trim(),
    selectedCategory: !selectedCategory,
    selectedSubcategory: !selectedSubcategory,
    selectedStartTime: !selectedStartTime,
    selectedEndTime: !selectedEndTime,
  };

  const allFieldsValid =
    Object.values(fieldErrors).every((v) => !v) && !noDaysSelected;

  const handleNextClick = async() => {
    setErrors(fieldErrors);
    setShowErrorBox(!allFieldsValid);
    setShowRowError(noDaysSelected);

    if (!allFieldsValid) return;
    try{
      const formData = new FormData();
      formData.append('owner_name', ownername);
      formData.append('facility_name', facilityname);
      formData.append('facility_location', facilitylocation);
      formData.append('category', selectedCategory);
      formData.append('specific_category', selectedSubcategory);
      formData.append('working_days', JSON.stringify(selectedDays));      
      formData.append('start_time', selectedStartTime);
      formData.append('end_time', selectedEndTime);
      await facilityProfile(formData);
      console.log("All fields valid. Continue to next step.");
      onNext();
    }
    catch{

    }
  };

  return (
    <div className={styles.frameGroup}>
      <div className={styles.frameContainer}>
        <div className={styles.numberParent}>
          <div className={styles.provideKeyDetails}>
            Provide key details about your service facility that will be visible
            to clients browsing and booking services through the platform.
          </div>
          <div className={styles.allFieldsRequired}>
            *All fields required unless noted.
          </div>
        </div>
        <div className={styles.textField}>
          <div className={styles.labelWrapper}>
            <div className={styles.label}>*Owner name</div>
          </div>

          <div
            className={`${styles.textField1} ${
              errors.ownername ? styles.errortextField1 : ""
            }`}
          >
            <input
              type="text"
              value={ownername}
              onChange={(e) => setOwnerName(e.target.value)}
              onFocus={() =>
                setErrors((prev) => ({ ...prev, ownername: false }))
              }
              placeholder={errors.ownername ? " " : "Enter owner name"}
              className={`${styles.inputField} ${
                errors.ownername ? styles.errorInput : ""
              }`}
            />
          </div>
        </div>

        <div className={styles.textField}>
          <div className={styles.labelWrapper}>
            <div className={styles.label}>*Facility Name</div>
          </div>
          <div
            className={`${styles.textField1} ${
              errors.facilityname ? styles.errortextField1 : ""
            }`}
          >
            <input
              type="text"
              value={facilityname}
              onChange={(e) => setFacilityName(e.target.value)}
              onFocus={() =>
                setErrors((prev) => ({
                  ...prev,
                  facilityname: false,
                }))
              }
              placeholder={errors.facilityname ? " " : "Enter facility name"}
              className={`${styles.inputField} ${
                errors.facilityname ? styles.errorInput : ""
              }`}
            />
          </div>
        </div>
        <div className={styles.textField}>
          <div className={styles.labelWrapper}>
            <div className={styles.label}>*Location</div>
          </div>
          <div
            className={`${styles.textField1} ${
              errors.facilitylocation ? styles.errortextField1 : ""
            }`}
          >
            <input
              type="text"
              value={facilitylocation}
              onChange={(e) => setFacilityLocation(e.target.value)}
              onFocus={() =>
                setErrors((prev) => ({
                  ...prev,
                  facilitylocation: false,
                }))
              }
              placeholder={
                errors.facilitylocation ? " " : "Enter facility location"
              }
              className={`${styles.inputField} ${
                errors.facilitylocation ? styles.errorInput : ""
              }`}
            />
          </div>
        </div>
        <div className={styles.frameWrapper}>
          <div className={styles.textFieldParent}>
            <div className={styles.textField6}>
              <div className={styles.labelWrapper}>
                <div className={styles.label}>*Category</div>
              </div>
              <div className={styles.dropdownContainer}>
                <div
                  className={`${styles.textField2} ${
                    isCategoryOpen ? styles.dropdownOpen : ""
                  } ${selectedCategory ? styles.filled : ""} ${
                    errors.selectedCategory ? styles.errorInput : ""
                  }`}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <div className={styles.category}>
                    <span>{selectedCategory || "Select category"}</span>
                  </div>
                  <div className={styles.icons}>
                    <Image
                      className={`${styles.vectorIcon7} ${
                        isCategoryOpen ? styles.rotated : ""
                      }`}
                      width={12}
                      height={7.4}
                      sizes="100vw"
                      alt=""
                      src="/icons.svg"
                    />
                  </div>
                </div>
                {isCategoryOpen && (
                  <div className={styles.dropdownMenu}>
                    {Categories.map((category) => (
                      <div
                        key={category.value}
                        className={styles.dropdownItem}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.textField8}>
              <div className={styles.labelWrapper}>
                <div className={styles.label}>*Specific Category</div>
              </div>
              <div className={styles.dropdownContainer}>
                <div
                  className={`${styles.textField2} ${
                    isSubcategoryOpen ? styles.dropdownOpen : ""
                  } ${selectedSubcategory ? styles.filled : ""} ${
                    errors.selectedSubcategory ? styles.errorInput : ""
                  }`}
                  onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
                >
                  <div className={styles.category}>
                    <span>
                      {selectedSubcategory || "Select specific category"}
                    </span>
                  </div>
                  <div className={styles.icons}>
                    <Image
                      className={`${styles.vectorIcon7} ${
                        isSubcategoryOpen ? styles.rotated : ""
                      }`}
                      width={12}
                      height={7.4}
                      sizes="100vw"
                      alt=""
                      src="/icons.svg"
                    />
                  </div>
                </div>
                {isSubcategoryOpen && selectedCategory && (
                  <div className={styles.dropdownMenu}>
                    {Categories.find(
                      (c) => c.label === selectedCategory
                    )?.subcategories.map((sub) => (
                      <div
                        key={sub}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setSelectedSubcategory(sub);
                          setIsSubcategoryOpen(false);
                        }}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.textField10}>
          <div className={styles.labelWrapper}>
            <div className={styles.label}>*Working Days</div>
          </div>

          <div className={styles.labelGroup}>
            <div className={styles.label}>{getLabel()}</div>
          </div>

          <div className={styles.row}>
            {workingDaysList.map((day) => (
              <div
                key={day}
                className={`${
                  selectedDays.includes(day)
                    ? styles.contentLightModeSelected
                    : styles.contentLightMode
                } ${
                  showRowError && !selectedDays.includes(day)
                    ? styles.errorCircle
                    : ""
                }`}
                onClick={() => toggleDay(day)}
              >
                <div className={styles.mo}>{day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.textFieldGroup}>
          <div className={styles.textField12}>
            <div className={styles.webDesigns}>*Working Hours</div>
            <div className={styles.labelGroup}>
              <div className={styles.label}>*Start Time</div>
              <div className={styles.passwordHideSee}>
                <div className={styles.icon}>
                  <Image
                    className={styles.iconChild}
                    width={18.2}
                    height={16}
                    sizes="100vw"
                    alt=""
                    src="Group 1.svg"
                  />
                </div>
                <div className={styles.hide}>Hide</div>
              </div>
            </div>
            <div className={styles.dropdownContainer}>
              <div
                className={`${styles.textField2} ${
                  isStartTimeOpen ? styles.dropdownOpen : ""
                } ${selectedStartTime ? styles.filled : ""} ${
                  errors.selectedStartTime ? styles.errorInput : ""
                }`}
                onClick={() => setIsStartTimeOpen(!isStartTimeOpen)}
              >
                <div className={styles.category}>
                  <span>{selectedStartTime || "Select start time"}</span>
                </div>
                <div className={styles.icons}>
                  <Image
                    className={`${styles.vectorIcon7} ${
                      isStartTimeOpen ? styles.rotated : ""
                    }`}
                    width={12}
                    height={7.4}
                    sizes="100vw"
                    alt=""
                    src="/icons.svg"
                  />
                </div>
              </div>

              {isStartTimeOpen && (
                <div className={styles.dropdownMenu}>
                  {generateTimeOptions().map((time) => (
                    <div
                      key={time}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setSelectedStartTime(time);
                        setIsStartTimeOpen(false);
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.textField14}>
            <div className={styles.labelParent2}>
              <div className={styles.label}>to</div>
              <div className={styles.passwordHideSee}>
                <div className={styles.icon}>
                  <Image
                    className={styles.iconChild}
                    width={18.2}
                    height={16}
                    sizes="100vw"
                    alt=""
                    src="Group 1.svg"
                  />
                </div>
                <div className={styles.hide}>Hide</div>
              </div>
            </div>
            <div className={styles.textField15}>
              <div className={styles.inputs}>
                <div className={styles.webDesigns1}>
                  Enter your profile name
                </div>
                <div className={styles.inputsItem} />
              </div>
              <div className={styles.icons}>
                <Image
                  className={styles.vectorIcon}
                  width={12}
                  height={7.4}
                  sizes="100vw"
                  alt=""
                  src="/icons.svg"
                />
              </div>
            </div>
            <div className={styles.errorMessage2}>Error message</div>
          </div>
          <div className={styles.textField16}>
            <div className={styles.labelGroup}>
              <div className={styles.label}>*End Time</div>
              <div className={styles.passwordHideSee}>
                <div className={styles.icon}>
                  <Image
                    className={styles.iconChild}
                    width={18.2}
                    height={16}
                    sizes="100vw"
                    alt=""
                    src="Group 1.svg"
                  />
                </div>
                <div className={styles.hide}>Hide</div>
              </div>
            </div>
            <div className={styles.dropdownContainer}>
              <div
                className={`${styles.textField2} ${
                  isEndTimeOpen ? styles.dropdownOpen : ""
                } ${selectedEndTime ? styles.filled : ""} ${
                  errors.selectedEndTime ? styles.errorInput : ""
                }`}
                onClick={() => setIsEndTimeOpen(!isEndTimeOpen)}
              >
                <div className={styles.category}>
                  <span>{selectedEndTime || "Select end time"}</span>
                </div>
                <div className={styles.icons}>
                  <Image
                    className={`${styles.vectorIcon7} ${
                      isEndTimeOpen ? styles.rotated : ""
                    }`}
                    width={12}
                    height={7.4}
                    sizes="100vw"
                    alt=""
                    src="/icons.svg"
                  />
                </div>
              </div>

              {isEndTimeOpen && (
                <div className={styles.dropdownMenu}>
                  {generateTimeOptions().map((time) => (
                    <div
                      key={time}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setSelectedEndTime(time);
                        setIsEndTimeOpen(false);
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.messageWrapper}>
        <div
          className={`${styles.privacyNotice} ${
            showErrorBox ? styles.hidden : styles.visible
          }`}
        >
          Your privacy is our priority. This information is used only for
          account verification and to personalize your experience. We will sell
          your data.
        </div>

        <div
          className={`${styles.errorbox} ${
            showErrorBox ? styles.visible : styles.hidden
          }`}
        >
          Please complete all required fields before continuing.
        </div>
      </div>

      <div
        className={styles.button2}
        style={{
          backgroundColor: "#a68465",
          opacity: allFieldsValid ? "1" : "0.5",
          transition: "opacity 0.2s ease",
        }}
        onClick={handleNextClick}
      >
        <div className={styles.signUpWrapper}>
          <div className={styles.webDesigns12}>Next</div>
        </div>
      </div>
    </div>
  );
}
