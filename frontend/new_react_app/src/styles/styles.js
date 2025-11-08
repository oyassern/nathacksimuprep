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
    color: '#000000', // ensures text is always visible
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

  // 👇 Responsive tweaks for wider screens
  '@media (min-width: 768px)': {
    gradientBg: {
      padding: '40px',
    },
    card: {
      maxWidth: '500px',
    },
    ovalButton: {
      width: '100%',
    },
  },
};

export default styles;
