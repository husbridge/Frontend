// //import useAuth from "./useAuth"
// import axiosInstance from "@services/api.services"

// const useRefreshToken = () => {
//     //const {  dispatch } = useAuth()
//     //const storedUser = localStorage.getItem("user")
//     const storedJwt = localStorage.getItem('jwt');
   
//     const refresh = async () => {
       
       
//         const response = await axiosInstance.post("/auth/refresh-tokens", {
//             refreshToken: JSON.parse(storedJwt||"")?.refresh.token || "",
//         })
    
//     // dispatch({
//     //     type: "SET_USER_DATA",
//     //     payload: {
        
//     //     JSON.parse(storedUser || "") || null,
//     //     },
//     // })
//     console.log(response.data, "fff")
    
//     return response.data.access.token
    
// }
//     return refresh
// }
// export default useRefreshToken
