# EmployeeInfoApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.7.

## Project Overview

### Technologies Used
- **Angular**
- **PrimeNG** (for styling)
- **JSON-Server** (as a mock database)

### Pages

#### Page 1: Welcome Page
- **Route:** `/Welcome`
- **Features:**
  - Language option (English/Turkish)
  - User can continue as an employee (no add/delete permissions)
  - User can continue as an employer (full access to the employee list, including add/delete permissions)

#### Page 2: Listing Page
- **Route:** `/list`
- **Features:**
  - "Add New Employee" button above the table
  - "Delete {selected_rows_number} Rows" button above the table if there is at least 1 selected row
  - Searchable table
  - **Table Columns:**
    - CheckBoxes to select a row
    - Status (true/false)
    - ID
    - First Name
    - Last Name
    - Phone Number
    - Email
    - Department (enum)
    - Salary (with currency pipe)
    - Entry Date
    - Leave Date
    - Actions (Edit/Delete buttons for each row)

#### Page 3: Add Employee Page
- **Route:** `/new-employee`
- **Features:**
  - Reactive form with validation
  - **Form Fields:**
    - Status (true/false) (switch or checkbox)
    - ID input (not shown, generated automatically on success save)
    - First Name (required, min 3 characters, max 256 characters)
    - Last Name (required, min 3 characters, max 256 characters)
    - Phone Number (required, only numbers)
    - Email (required, email validation)
    - Department (required, dropdown using enums)
    - Salary (displayed with currency pipe in dollars)
    - Entry Date (required, date picker)
    - Leave Date (shown only if status is false, date picker)
    - Save Button

#### Page 4: Edit Employee Page
- **Route:** `/employee/[employee_id]` (dynamic route)
- **Features:**
  - Same form as the Add Employee Page
  - ID field is displayed but not editable (disabled)

### Tasks done:
- **Interface:** Implement interface files for clean TypeScript structure
- **CRUD Operations:** Implement service files for CRUD operations (GET, POST, etc.)
- **ID Generation:** Generate a unique 9-digit ID automatically and check for uniqueness
- **Styling:** Use PrimeNG components for all styling needs
- **Backend:** Use JSON Server as the backend to handle requests
- **Toast Messages:** Implement success and error toast messages for save, edit, and delete actions
- **Form Validation:** Display error messages on inputs if the forms are invalid
- **Language Support:** Implement dynamic language support using `en.json` and `tr.json` with a translate feature
- **Additional Improvements:**
  - Implement route guards to enhance Angular skills
  - Implement interceptors for adding toast messages


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## JSON Server

Run `npx json-server --watch db.json --port 3000` command to start JSON Server.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
