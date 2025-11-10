-- 002_initiate_data.sql
-- Insert sample simulation data

INSERT INTO simulations (name, program, description) VALUES
('Dog Fight', 'animal_health', 'Managing multiple trauma cases in animals'),
('Euthanasia: Cat', 'animal_health', 'Client communication and euthanasia procedures'),
('Euthanasia: Terrier', 'animal_health', 'End-of-life care and client support'),
('NAIT Pool: Pediatric Choking/Arrest', 'paramedicine', 'Pediatric emergency response training'),
('Peds ER: Cardiac Emergency', 'paramedicine', 'Pediatric cardiac emergency management'),
('RESP 2695 (Pediatric OR - PALS)', 'respiratory_therapy', 'Pediatric operating room respiratory care'),
('Stage 1: Induction and Emergence', 'respiratory_therapy', 'Anesthesia induction and emergence procedures'),
('Stage 2: Cardiac Arrest – Post op', 'respiratory_therapy', 'Post-operative cardiac arrest management'),
('Stage 3: Withdrawal of Care', 'respiratory_therapy', 'End-of-life care and family support'),
('Stage 4: Withdrawal of Care', 'respiratory_therapy', 'Advanced end-of-life care scenarios');