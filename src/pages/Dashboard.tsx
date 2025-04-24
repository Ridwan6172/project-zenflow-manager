/* Global Styles */
body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(145deg, #6a11cb, #2575fc);
  color: #333;
}

.container {
  max-width: 100%; /* Allows the container to stretch fully */
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}


/* Header */
h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  transition: color 0.3s ease;
}

h1:hover {
  color: #2575fc;
}

/* Button Styles */
button {
  padding: 10px 20px;
  background-color: #2575fc;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: inline-flex;
  align-items: center;
}

button:hover {
  background-color: #6a11cb;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #2575fc;
}

button .mr-1 {
  margin-right: 8px;
}

/* Flex Layout for Dashboard */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.sm\:flex-row {
  flex-direction: row;
}

.justify-between {
  justify-content: space-between;
}

.items-start {
  align-items: flex-start;
}

.sm\:items-center {
  align-items: center;
}

.mb-6 {
  margin-bottom: 24px;
}

.mb-4 {
  margin-bottom: 16px;
}

.sm\:mb-0 {
  margin-bottom: 0;
}

/* Modal Styling */
.AddEditProjectModal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
  opacity: 0;
  pointer-events: none;
}

.AddEditProjectModal.open {
  opacity: 1;
  pointer-events: all;
}

.AddEditProjectModal .modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transform: scale(0.9);
  animation: modal-in 0.3s forwards;
}

@keyframes modal-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Table Styles */
.ProjectTable table {
  width: 100%; /* Ensures the table takes up 100% of the available width */
  margin-top: 20px;
  border-collapse: collapse;
}


.ProjectTable th, .ProjectTable td {
  padding: 15px;
  text-align: left;
  font-size: 1.1rem;
}

.ProjectTable th {
  background-color: #f7f7f7;
  font-weight: 700;
  color: #333;
}

.ProjectTable tr:nth-child(even) {
  background-color: #f9fafb;
}

.ProjectTable tr:hover {
  background-color: #f1f5f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

/* Project Filters */
.ProjectFilters {
  margin-bottom: 30px;
}

.ProjectFilters select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: border-color 0.3s ease;
}

.ProjectFilters select:focus {
  border-color: #2575fc;
  outline: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  h1 {
    font-size: 2rem;
  }

  .ProjectTable table {
    font-size: 0.9rem;
  }

  .flex {
    flex-direction: column;
  }

  .flex-row {
    flex-direction: column;
  }
}
