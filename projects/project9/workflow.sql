CREATE TABLE items
(
  item_id          int           NOT NULL AUTO_INCREMENT,
  item_type        int           NOT NULL,
  item_description varchar(500)  NOT NULL,
  item_priority    int           NOT NULL,
  item_status      int           NOT NULL,
  assigned_to      int           NOT NULL,
  project_id       int           NOT NULL,
  project_counter  int           NOT NULL,
  PRIMARY KEY (item_id)
) ENGINE=InnoDB;

CREATE TABLE employees
(
  employee_id      int           NOT NULL AUTO_INCREMENT,
  employee_name    varchar(255)  NOT NULL,
  employee_active  int           NOT NULL,
  PRIMARY KEY (employee_id)
) ENGINE=InnoDB;

CREATE TABLE projects
(
  project_id      int           NOT NULL AUTO_INCREMENT,
  project_name    varchar(255)  NOT NULL,
  project_abbrev  varchar(10)   NOT NULL,
  project_active  int           NOT NULL,
  PRIMARY KEY (project_id)
) ENGINE=InnoDB;

ALTER TABLE items ADD INDEX idx_item_status (item_status);
ALTER TABLE items ADD INDEX idx_assigned_to (assigned_to);
ALTER TABLE items ADD INDEX idx_project_id (project_id);
ALTER TABLE employees ADD INDEX idx_employee_active (employee_active);
ALTER TABLE projects ADD INDEX idx_project_active (project_active);

INSERT INTO employees (employee_id, employee_name, employee_active) VALUES (NULL, 'Jane Smith', 1);
INSERT INTO employees (employee_id, employee_name, employee_active) VALUES (NULL, 'Jim Smith', 1);
INSERT INTO employees (employee_id, employee_name, employee_active) VALUES (NULL, 'Ted Jones', 1);
INSERT INTO employees (employee_id, employee_name, employee_active) VALUES (NULL, 'Janet Doe', 1);
INSERT INTO employees (employee_id, employee_name, employee_active) VALUES (NULL, 'Tim Davis', 1);

INSERT INTO projects (project_id, project_name, project_abbrev, project_active) VALUES (NULL, 'Delta Construction', 'DECC', 1);
INSERT INTO projects (project_id, project_name, project_abbrev, project_active) VALUES (NULL, 'Sophis Construction', 'SECC', 1);
INSERT INTO projects (project_id, project_name, project_abbrev, project_active) VALUES (NULL, 'Excelsior Five', 'X5SS', 1);
INSERT INTO projects (project_id, project_name, project_abbrev, project_active) VALUES (NULL, 'Perfos Industries', 'PFII', 1);
INSERT INTO projects (project_id, project_name, project_abbrev, project_active) VALUES (NULL, 'Deon Orthodontics', 'DEOO', 1);

INSERT INTO items (item_id, item_type, item_description, item_priority, item_status, assigned_to, project_id, project_counter) VALUES (NULL, 1, 'Database connection limit exceeded', 1, 1, 0, 1, 1);
INSERT INTO items (item_id, item_type, item_description, item_priority, item_status, assigned_to, project_id, project_counter) VALUES (NULL, 1, 'Typo in staff bio for John Doe', 3, 1, 2, 1, 2);
INSERT INTO items (item_id, item_type, item_description, item_priority, item_status, assigned_to, project_id, project_counter) VALUES (NULL, 1, 'Hyphenated names not being handled properly in search', 2, 1, 0, 1, 3);
INSERT INTO items (item_id, item_type, item_description, item_priority, item_status, assigned_to, project_id, project_counter) VALUES (NULL, 1, 'Admin links not all updated to new URL', 1, 1, 2, 1, 4);
INSERT INTO items (item_id, item_type, item_description, item_priority, item_status, assigned_to, project_id, project_counter) VALUES (NULL, 1, 'Truncate extra zeros in calculated values', 3, 1, 2, 1, 5);
INSERT INTO items (item_id, item_type, item_description, item_priority, item_status, assigned_to, project_id, project_counter) VALUES (NULL, 2, 'Implement a print-specific stylesheet', 2, 1, 3, 1, 6);
INSERT INTO items (item_id, item_type, item_description, item_priority, item_status, assigned_to, project_id, project_counter) VALUES (NULL, 2, 'Allow partial matches in searches; at least 3 characters required', 2, 1, 0, 1, 7);
INSERT INTO items (item_id, item_type, item_description, item_priority, item_status, assigned_to, project_id, project_counter) VALUES (NULL, 3, 'Update security certificate', 1, 1, 1, 1, 8);
INSERT INTO items (item_id, item_type, item_description, item_priority, item_status, assigned_to, project_id, project_counter) VALUES (NULL, 1, 'ODBC connection error', 1, 0, 5, 2, 1);
INSERT INTO items (item_id, item_type, item_description, item_priority, item_status, assigned_to, project_id, project_counter) VALUES (NULL, 3, 'User needs account created', 1, 1, 5, 3, 1);
INSERT INTO items (item_id, item_type, item_description, item_priority, item_status, assigned_to, project_id, project_counter) VALUES (NULL, 3, 'Update subdomain security certificate', 1, 0, 3, 2, 2);