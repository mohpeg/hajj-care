-- Insert data into clinics_visits table
INSERT INTO clinics_visits (cv_visit_date, cv_citizen_hajj_id, cv_citizen_clinic_id, cv_citizen_hotel_id, cv_citizen_room_no, cv_citizen_passport, cv_diagnosis_grp, cv_symptoms, cv_diagnosis_id, cv_referral_hosp_id, cv_notes)
VALUES
('2025-04-05T00:00:00', 15, 221, 1, 456, '6911577', 3, 19, 21, 0, ''),
('2025-04-05T00:00:00', 62, 221, 1, 100, 'A39872196', 10, 54, 65, 0, ''),
('2025-04-05T00:00:00', 75, 221, 1, 75, 'A32791884', 5, 26, 31, 0, '');

-- Insert data into oncology table
INSERT INTO oncology (oncol_citizen_hajj_id, oncol_citizen_division, oncol_citizen_passport, oncol_citizen_indate, oncol_session_date, oncol_citizen_hosp, oncol_citizen_hotel, oncol_citizen_room_no, oncol_notes)
VALUES
(31, 1, 'A33054717', '2025-03-22T00:00:00', '2025-03-22T00:00:00', 1, NULL, 5, 'fdfsdf'),
(31, 1, 'A33054717', '2025-03-29T00:00:00', '2025-03-29T00:00:00', 2, NULL, 5, 'testttttttttt');

-- Insert data into dialysis table
INSERT INTO dialysis (kd_citizen_hajj_id, kd_citizen_division, kd_citizen_passport, kd_citizen_hosp, kd_citizen_session_date, kd_citizen_notes)
VALUES
(31, 1, 'A33054717', 1, '2025-03-22T00:00:00', 'fdfsdf'),
(31, 1, 'A33054717', 2, '2025-03-29T00:00:00', 'testttttttttt');