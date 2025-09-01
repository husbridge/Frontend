import axiosInstance from "./api.services";

const ENDPOINT = "payment";

export const initiatePayment = (data: any) => {
    return axiosInstance.post(ENDPOINT + "/setup-card", data);
};

export const getPaymentStatus = () => {
    return axiosInstance.get(ENDPOINT + "/status");
};