import "/src/css/Notificacion.css";

const Notificacion = ({ notificaciones, cerrarNotificacion }) => {
  return (
    <div className="contenedor__notificaciones">
      {notificaciones
        .filter(
          (notificacion) => notificacion !== null && notificacion !== undefined
        )
        .map(
          (notificacion) =>
            notificacion.visible && (
              <div key={notificacion.id} className="container_notificacion">
                <div className={`registro_ok ${notificacion.color}`}>
                  <img
                    className="imgnoti"
                    src={`src/img/${notificacion.imagen}.png`}
                  />
                  <h2>{notificacion.mensaje}</h2>
                </div>
                <div
                  className="cerrar_noti"
                  onClick={() => cerrarNotificacion(notificacion.id)}
                />
              </div>
            )
        )}
    </div>
  );
};

export default Notificacion;
