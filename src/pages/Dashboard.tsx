
/* Global Styles */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(145deg, #6a11cb, #2575fc);
}

.container {
  min-height: 100vh;
  width: 100%;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

/* Header Styles */
.dashboard-header {
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

h1 {
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  h1 {
    font-size: 1.875rem;
  }
}

/* Glass Effect for Cards */
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
}
