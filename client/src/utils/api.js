import axios from 'axios';

export const updateUser = async (token, userId, values) => {
  try {
    const res = await axios.put(`http://localhost:8080/user/updateUser/${userId}`, values, {
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
