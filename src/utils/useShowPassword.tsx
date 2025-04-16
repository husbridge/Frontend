import { useState } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';

const useShowPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const displayPasswordIcon = () => {
        if (showPassword) {
            return (
                <IoIosEyeOff
                    className="text-[#6F6F6F] text-lg cursor-pointer"
                    onClick={handleShowPassword}
                />
            );
        } else {
            return (
                <IoIosEye
                    className="text-[#6F6F6F] text-lg cursor-pointer"
                    onClick={handleShowPassword}
                />
            );
        }
    };

    return {
        showPassword,
        displayPasswordIcon,
    };
};


export default useShowPassword;