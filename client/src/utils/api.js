import axios from 'axios';
  const API_URL = process.env.REACT_APP_API_URL;

export const updateUser = async (token, userId, values) => {
  try {
    const res = await axios.put(`${API_URL}/user/updateUser/${userId}`, values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
