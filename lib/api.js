import axios from "axios";
const apiUrl = "https://tufvoucherbackend.vercel.app/api/app";

export const getVoucherDetails = async (voucherId) => {
  try {
    const response = await axios.get(`${apiUrl}/voucher/${voucherId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const validateVoucher = async (voucherId) => {
  try {
    const res = await axios.post(`${apiUrl}/voucher`, {
      "passId":voucherId,
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const getAnalytics = async () => {
  try {
    const res = await axios.get(`${apiUrl}/analytics`);
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
