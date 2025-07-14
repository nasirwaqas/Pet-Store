import axios from 'axios';

export const updateUser = async (token, userId, values) => {
  try {
    const res = await axios.put(`https://pet-store-zeta-rust.vercel.app/user/updateUser/${userId}`, values, {
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
