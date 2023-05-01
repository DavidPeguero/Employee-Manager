INSERT INTO departments (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");
      
INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead",100000, 1),
       ("Salesperson",80000, 1),
       ("Lead Engineer",150000, 2),
       ("Legal Team Lead",250000, 4),
       ("Lawyer",190000, 4),
       ("Manager",190000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 19, null),
       ("Mike", "Chan", 20, 1),
       ("Ashley", "Rodriguez", 20, null),
       ("Kevin", "Tupik", 20, 3),
       ("Sarah", "Lourd", 23, null),
       ("Missy", "Manager", 24, null);