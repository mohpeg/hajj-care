-- PostgreSQL-compatible schema
CREATE TABLE Category (
    Cat_id INT NOT NULL,
    Cat_desc VARCHAR(50)
);

CREATE TABLE clinics_visits (
    cv_id SERIAL PRIMARY KEY,
    cv_visit_date TIMESTAMP,
    cv_citizen_hajj_id INT,
    cv_citizen_clinic_id INT,
    cv_citizen_hotel_id INT,
    cv_citizen_room_no INT,
    cv_citizen_passport VARCHAR(11),
    cv_diagnosis_grp INT,
    cv_symptoms INT,
    cv_diagnosis_id INT,
    cv_referral_hosp_id INT,
    cv_notes TEXT,
    Create_user_id INT,
    Create_Date TIMESTAMP,
    Update_user_id INT,
    Upadate_Date TIMESTAMP
);

CREATE TABLE clinics_visits_drug (
    drug_id SERIAL,
    drug_cv_id INT NOT NULL,
    drug_amount INT,
    Create_user_id INT,
    Create_Date TIMESTAMP,
    Update_user_id INT,
    Upadate_Date TIMESTAMP,
    PRIMARY KEY (drug_id, drug_cv_id)
);

CREATE TABLE CorrelationLogs (
    Id SERIAL PRIMARY KEY,
    CorrelationId VARCHAR(100) UNIQUE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE countries (
    country_code CHAR(2) PRIMARY KEY DEFAULT '',
    country_Nationality VARCHAR(100) NOT NULL DEFAULT ''
);

CREATE TABLE death_cases (
    dc_id SERIAL PRIMARY KEY,
    dc_regDate DATE,
    dc_hajj_id INT,
    dc_passport VARCHAR(11),
    dc_hosp INT,
    dc_causeofdeath INT,
    dc_dateofdeath TIMESTAMP,
    dc_notes TEXT,
    Create_user_id INT,
    Create_Date TIMESTAMP,
    Update_user_id INT,
    Upadate_Date TIMESTAMP
);

CREATE TABLE dialysis (
    kd_citizen_id SERIAL PRIMARY KEY,
    kd_citizen_hajj_id INT,
    kd_citizen_division INT,
    kd_citizen_hotel INT,
    kd_citizen_room_no INT,
    kd_citizen_passport VARCHAR(11),
    kd_citizen_virusec INT,
    kd_citizen_hosp INT,
    kd_citizen_session_date TIMESTAMP,
    kd_citizen_notes TEXT,
    Create_user_id INT,
    Create_Date TIMESTAMP,
    Update_user_id INT,
    Upadate_Date TIMESTAMP
);

CREATE TABLE DIST (
    GOVERN_CD INT NOT NULL,
    DISTRCT_CD_new INT,
    DISTRCT_CD INT NOT NULL,
    DISTRCT_NM VARCHAR(255),
    S_YEAR VARCHAR(255),
    E_YEAR INT,
    usernm VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE Fac (
    Fac_code INT NOT NULL,
    Gov_cd INT,
    Dist_cd_New INT,
    Dist_cd INT,
    Facility_NM TEXT,
    sector INT,
    Flag_family_planning BOOLEAN,
    Flag_MP BOOLEAN,
    Fac_Cat INT,
    Fac_Type INT,
    kesm INT,
    village INT,
    X_coordinate FLOAT,
    Y_coordinate FLOAT,
    HIS_code INT,
    GIS_code TEXT,
    CSO_code TEXT,
    ur FLOAT,
    usernm TEXT,
    password TEXT,
    Confirm_fld INT,
    notes TEXT,
    fac_cd_old FLOAT,
    U_R INT,
    Gov_Directory FLOAT,
    flag INT,
    Active BOOLEAN,
    sort INT,
    bm_flag INT,
    spbm_flag INT
);

CREATE TABLE Govs (
    GOVERN_CD INT PRIMARY KEY,
    GOVERN_NM TEXT
);

CREATE TABLE LK_diagnosis (
    diag_id SERIAL,
    diag_grpcd INT NOT NULL,
    diag_name VARCHAR(250),
    PRIMARY KEY (diag_id, diag_grpcd)
);

CREATE TABLE LK_diagnosis_group (
    dgrp_id INT PRIMARY KEY,
    dgrp_name VARCHAR(250)
);

CREATE TABLE LK_diseases (
    disease_cd INT PRIMARY KEY,
    disease_name VARCHAR(250)
);

CREATE TABLE lookup_table (
    lk_lookup_id VARCHAR(50) NOT NULL,
    lk_id INT NOT NULL,
    lk_desc_ar VARCHAR(255),
    lk_desc_en VARCHAR(255),
    lk_udf VARCHAR(255),
    lk_udf2 VARCHAR(255),
    lk_notes VARCHAR(255),
    Create_user_id INT,
    Create_Date TIMESTAMP,
    Update_user_id INT,
    Upadate_Date TIMESTAMP,
    active BOOLEAN,
    PRIMARY KEY (lk_lookup_id, lk_id)
);

CREATE TABLE medical_committee (
    mexd_id SERIAL PRIMARY KEY,
    mexd_mex_id INT,
    mexd_doc_name VARCHAR(250),
    mexd_doc_specialization VARCHAR(250),
    Create_user_id INT,
    Create_Date TIMESTAMP,
    Update_user_id INT,
    Upadate_Date TIMESTAMP
);

CREATE TABLE medical_examination (
    mex_id SERIAL PRIMARY KEY,
    mex_eval_date TIMESTAMP NOT NULL,
    mex_citizen_gov INT NOT NULL,
    mex_citizen_dist INT NOT NULL,
    mex_citizen_sec INT,
    mex_citizen_fac INT NOT NULL,
    mex_citizen_name VARCHAR(250),
    mex_citizen_gender_id INT,
    mex_citizen_age INT,
    mex_citizen_mobile VARCHAR(11),
    mex_citizen_nid VARCHAR(14),
    mex_citizen_passport VARCHAR(11),
    mex_citizen_haj_type_id INT,
    mex_citizen_address VARCHAR(250),
    mex_citizen_weight INT,
    mex_citizen_height INT,
    mex_citizen_bmi FLOAT,
    mex_citizen_diseases_id VARCHAR(50),
    mex_citizen_treatment_id INT,
    mex_citizen_special_needs_id VARCHAR(50),
    mex_citizen_other_needs VARCHAR(250),
    mex_citizen_is_pregnant INT,
    mex_citizen_pregnancydate TIMESTAMP,
    mex_citizen_mcondition_id VARCHAR(50),
    mex_citizen_mental_treatment INT,
    mex_citizen_mental_treat_notes VARCHAR(250),
    mex_citizen_mental_treatment_date TIMESTAMP,
    mex_citizen_need_dialysis INT,
    mex_citizen_chemotherapy INT,
    mex_citizen_is_obesity INT,
    mex_citizen_zheimer INT,
    mex_citizen_is_blind INT,
    mex_citizen_is_paralyzed INT,
    mex_citizen_check INT,
    mex_citizen_chest_xray INT,
    mex_citizen_cbc INT,
    mex_citizen_fbs INT,
    mex_citizen_pp INT,
    mex_citizen_hcg INT,
    mex_citizen_abdominal_xray INT,
    mex_citizen_ultrasound INT,
    mex_citizen_special_needs VARCHAR(250),
    mex_citizen_urine_acr FLOAT,
    mex_citizen_urine_urea FLOAT,
    mex_citizen_liver_sgot FLOAT,
    mex_citizen_liver_sgpt FLOAT,
    mex_citizen_result INT,
    integration_flag INT,
    Create_user_id INT,
    Create_Date TIMESTAMP,
    Update_user_id INT,
    Upadate_Date TIMESTAMP,
    mex_citizen_death INT
);

CREATE TABLE oncology (
    oncol_citizen_id SERIAL PRIMARY KEY,
    oncol_citizen_hajj_id INT,
    oncol_citizen_division INT,
    oncol_citizen_passport VARCHAR(11),
    oncol_citizen_indate TIMESTAMP,
    oncol_session_date TIMESTAMP,
    oncol_citizen_hosp INT,
    oncol_citizen_hotel INT,
    oncol_citizen_room_no INT,
    oncol_notes TEXT,
    Create_user_id INT,
    Create_Date TIMESTAMP,
    Update_user_id INT,
    Upadate_Date TIMESTAMP
);

CREATE TABLE pilgrims_data (
    hajj_id SERIAL PRIMARY KEY,
    hajj_gov INT,
    hajj_name VARCHAR(250),
    hajj_gender_id INT,
    hajj_age INT,
    hajj_nid VARCHAR(14),
    hajj_passport VARCHAR(11),
    hajj_type_id INT
);

CREATE TABLE referral (
    refl_id SERIAL PRIMARY KEY,
    refl_no INT,
    refl_to INT,
    refl_reason INT,
    refl_method INT,
    refl_division INT,
    refl_citizen_hajj_id INT,
    refl_hotel_id INT,
    refl_room_no INT,
    refl_hosp_id INT,
    refl_citizen_passport VARCHAR(11),
    refl_symptoms INT,
    refl_diagnosis_grp INT,
    refl_diagnosis_id INT,
    refl_indate TIMESTAMP,
    refl_outdate TIMESTAMP,
    refl_out_status INT,
    refl_date TIMESTAMP,
    refl_doc_name VARCHAR(250),
    refl_notes VARCHAR(250),
    Create_user_id INT,
    Create_Date TIMESTAMP,
    Update_user_id INT,
    Upadate_Date TIMESTAMP
);
