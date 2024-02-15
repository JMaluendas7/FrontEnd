const Button = ({ label = "Buscar", isLoading, getData }) => {
  return (
    <button className="submit-button" onClick={getData} disabled={isLoading}>
      {isLoading ? "Generando..." : label}
    </button>
  );
};

export default Button;
