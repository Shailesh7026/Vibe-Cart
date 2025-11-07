export const fakeLogin = (user) => {
  localStorage.setItem('vibe_user', JSON.stringify(user));
  return { success: true, user };
};

export const getUser = () => {
  const user = localStorage.getItem('vibe_user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('vibe_user');
  return { success: true };
};