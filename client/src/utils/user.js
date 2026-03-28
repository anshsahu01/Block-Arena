export const getUser = () => {
  let userId = localStorage.getItem("userId");
  let color = localStorage.getItem("color");

  if (!userId) {
    userId = crypto.randomUUID();
    color = "#" + Math.floor(Math.random() * 16777215).toString(16);

    localStorage.setItem("userId", userId);
    localStorage.setItem("color", color);
  }

  return { userId, color };
};