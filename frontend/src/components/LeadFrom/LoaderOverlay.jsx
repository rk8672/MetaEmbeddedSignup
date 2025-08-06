const LoaderOverlay = ({ secondsLeft }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.loaderBox}>
        <div className="spinner" style={styles.spinner}></div>
        <p style={styles.text}>Waking up server... Please wait</p>
        <p style={styles.timer}>{secondsLeft}s</p>
      </div>
    </div>
  );
};

export default LoaderOverlay;
const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999
  },
  loaderBox: {
    background: "#fff", padding: "30px 50px", borderRadius: 12, textAlign: "center", boxShadow: "0 0 20px rgba(0,0,0,0.2)"
  },
  spinner: {
    width: 50, height: 50, margin: "auto",
    border: "5px solid #ccc", borderTop: "5px solid #00bcd4",
    borderRadius: "50%", animation: "spin 1s linear infinite"
  },
  text: {
    marginTop: 20, fontWeight: 500, fontSize: 16
  },
  timer: {
    fontSize: 18, color: "#00bcd4", marginTop: 10
  }
};

// Add this in your global CSS
// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }
