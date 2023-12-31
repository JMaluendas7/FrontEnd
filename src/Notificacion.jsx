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
                  <h2 className="txt_noti">{notificacion.mensaje}</h2>
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
