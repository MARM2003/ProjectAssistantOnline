export const NotificationProvider = ({ userId, children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userId) {
      socket.emit("registerUser", userId);
    }

    socket.on("receiveNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, [userId]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, socket }}>
      {children}
    </NotificationContext.Provider>
  );
};
