const styles = {
  app: {
    fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif",
    minHeight: '100vh',
    backgroundColor: '#FAFBFC',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  gradientBg: {
    background: 'linear-gradient(135deg, #002D72 0%, #4EA5D9 100%)',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5vw',
    boxSizing: 'border-box',
  },

  header: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: '#FFFFFF',
    fontSize: 'clamp(20px, 3vw, 28px)',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: 'min(5vw, 30px)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '420px',
    marginBottom: '20px',
    color: '#000000',
  },

  // New: Wider card for dashboard
  wideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: 'min(5vw, 30px)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '900px',
    marginBottom: '20px',
    color: '#000000',
  },

  button: {
    backgroundColor: '#002D72',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '20px',
    padding: '15px 30px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },

  // New: Secondary button for filters
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 15px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },

  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '2px solid #4EA5D9',
    fontSize: '16px',
    marginBottom: '15px',
    boxSizing: 'border-box',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },

  // New: Select input style
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '2px solid #4EA5D9',
    fontSize: '16px',
    marginBottom: '15px',
    boxSizing: 'border-box',
    color: '#000000',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  },

  ovalButton: {
    backgroundColor: '#FFFFFF',
    color: '#002D72',
    border: '3px solid #002D72',
    borderRadius: '50px',
    padding: '20px 40px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    margin: '10px 0',
    width: '90%',
    maxWidth: '300px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
  },

  // New: Table styles for dashboard
  tableContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
    border: '2px solid #e9ecef',
    borderRadius: '10px',
    marginBottom: '20px',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },

  tableHeader: {
    backgroundColor: '#002D72',
    color: '#FFFFFF',
    padding: '12px 8px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    position: 'sticky',
    top: 0,
  },

  tableCell: {
    padding: '10px 8px',
    textAlign: 'center',
    borderBottom: '1px solid #e9ecef',
  },

  tableCellLeft: {
    padding: '10px 8px',
    textAlign: 'left',
    borderBottom: '1px solid #e9ecef',
    fontWeight: 'bold',
    color: '#002D72',
  },

  // New: Stats container
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '2px solid #e9ecef',
  },

  statItem: {
    textAlign: 'center',
  },

  statValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#002D72',
    marginBottom: '5px',
  },

  statLabel: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '600',
  },

  // New: Filter container
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'end',
  },

  filterItem: {
    flex: '1',
    minWidth: '120px',
  },

  filterLabel: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#002D72',
    fontSize: '12px',
  },

  // New: Performance badge
  performanceBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'inline-block',
  },

  // 👇 Responsive tweaks for wider screens
  '@media (min-width: 768px)': {
    gradientBg: {
      padding: '40px',
    },
    card: {
      maxWidth: '500px',
    },
    wideCard: {
      maxWidth: '1000px',
    },
    ovalButton: {
      width: '100%',
    },
    table: {
      fontSize: '15px',
    },
    tableHeader: {
      padding: '15px 10px',
      fontSize: '15px',
    },
    tableCell: {
      padding: '12px 10px',
    },
    tableCellLeft: {
      padding: '12px 10px',
    },
  },

  // 👇 Mobile-specific styles
  '@media (max-width: 480px)': {
    filterContainer: {
      flexDirection: 'column',
    },
    filterItem: {
      minWidth: '100%',
    },
    statsContainer: {
      flexDirection: 'column',
      gap: '15px',
    },
    tableContainer: {
      maxHeight: '300px',
    },
  },
};

export default styles;