# employee-document-management-system
The Employee Document Management System is a web-based HRIS module that allows organizations to manage employees and their documents efficiently


### **Project Specifications: Employee Document Management System**

#### **1. Backend Stack**
   - **ASP.NET Core**: For building APIs and managing user roles with **ASP.NET Core Identity** for authentication and authorization.
   - **Marten**: For data persistence in **PostgreSQL**, handling employee and document storage.
   - **Wolverine**: For handling event-driven tasks like sending an invitation email when a new employee is created.
   - **ASP.NET Core Identity**: Manages user roles (Employee, HR, Admin) and ensures proper role-based access control.
   - **Azure Blob Storage**: Used to store the actual uploaded files securely, while Marten stores file metadata (e.g., file name, size, upload date).

#### **2. Frontend Stack**
   - **React**: For building the user interface, including employee management and document handling.
   - **RTK Redux**: To manage the application state, ensuring smooth data flow between the frontend and backend.
   - **Redux Saga or Thunk**: To handle side effects such as API requests for CRUD operations and file uploads.
   - **Material UI (MUI)**: For building a clean and responsive UI with ready-made components for forms, tables, and dialogs.

#### **3. Core Features**

1. **User Management with ASP.NET Core Identity**
   - A **seeded Admin user** is created when the system starts.
   - Admins can create new employee accounts using the employee creation form.
   - Upon creation, **an invitation email** is automatically sent to the employee with credentials or a link to set up their account.
   - ASP.NET Core Identity handles login, role assignments, and password management.

2. **Employee Management**
   - **Admin**:
     - Can create new employees, edit, view, and delete any employee.
     - Has access to all employee data, can invite new employees, and manage their roles.
   - **HR**:
     - HR can **see, filter, sort, add, remove, and edit** all employees.
     - They can perform the same operations as Admin, but only on employee data.
   - **Employee**:
     - Employees can **see, filter, and sort** other employees but cannot create, edit, or delete records.
     - Sorting and filtering options (e.g., by department, job title, or name) are available.

3. **Document Management**
   - **Employee and HR**:
     - Employees and HRs can **upload**, **view**, **filter**, and **sort** their documents (e.g., certificates, resumes).
     - Filtering options (e.g., by document type or upload date) are provided.
   - Documents are stored using **Marten** for metadata (e.g., file name, upload date) and Azure Blob Storage for a file content.

4. **Event-Driven Features with Wolverine**
   - When a new employee is created, Wolverine triggers an event to send an **invitation email** to the employee with login instructions.
   - Wolverine can also handle other background tasks, such as sending notifications for document uploads.

#### **4. User Interface (Frontend)**
   - **Employee Dashboard**: Shows a list of employees that can be filtered and sorted, with options to view or upload documents.
   - **HR Dashboard**: Similar to the employee dashboard, but with additional options to **add, edit, and remove** employees.
   - **Admin Dashboard**: Full access to employee and HR management, with options to manage roles, invite new users, and see system-wide statistics.
   - **Document Management**: A section where users (employees and HR) can upload, view, sort, and filter their documents.

#### **5. Key Functionalities**
   - **Admin**:
     - Manage users (create, edit, delete).
     - Assign roles (Employee, HR).
     - Seeded at the start with default login credentials.
   - **Employee & HR**:
     - See and manage employee lists.
     - Upload, sort, and filter documents.
     - HRs have elevated privileges to manage employee records.
