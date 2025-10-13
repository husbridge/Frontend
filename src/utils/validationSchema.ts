import * as yup from "yup"
import { isValidCacNumber } from "./helpers"

export const accountValidationSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email is required")
        .email("Please use a valid email address"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password cannot be longer than 20 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character"
        )
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        //@ts-expect-error ignore null
        .oneOf([yup.ref("password"), null], "Password does not match"),
})
export const confirmEmailAddressSchema = yup.object().shape({
    code: yup.string().required("OTP is required "),
})
export const agencyValidationSchema = yup.object().shape({
    regNumber: yup
        .string()
        .required("Registration number is required")
        .test(
            "valid-cac-format",
            "Please enter a valid CAC number (RC/BN/IT/LP/LLP + digits)",
            (value) => (value ? isValidCacNumber(value) : false)
        ),
    agencyName: yup.string().required("Agency name is required"),

    industry: yup.string().required("Industry is required"),
    address: yup.string().required("Address is required"),

    state: yup.object().required("State is required"),
    country: yup.object().required("Country is required"),
})
export const personalValidationSchema = yup.object().shape({
    fullName: yup.string().required("Fullname is required"),
    mobileNumber: yup.string().required("Phone Number is required"),
})
export const talentValidationSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),

    industry: yup.string().required("Industry is required"),
})

export const verificationValidationSchema = yup.object().shape({
    mobileNumber: yup.string().required("Mobile Number is required"),
})

export const loginValidationSchema = yup.object().shape({
    username: yup
        .string()
        .trim()
        .email("Please use a valid email address")
        .required("Email is required"),
    password: yup.string().required("Password is required"),
    //.min(8, "Password must be a minimum of 8 characters"),
})

export const clientLoginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .email("Please use a valid email address")
        .required("Email is required"),
    password: yup
        .string()
        .required("Password is required")
        .min(5, "Password must be a minimum of 5 characters"),
})

export const forgotPasswordValidationSchema = yup.object().shape({
    username: yup
        .string()
        .required("Email is required")
        .email("Please use a valid email address"),
})

export const resetPasswordSchema = yup.object().shape({
    password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be a minimum of 8 characters"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        //@ts-expect-error ignore null
        .oneOf([yup.ref("password"), null], "Password does not match"),
})

export const addManagerValidationSchema = yup.object().shape({
    fullName: yup.string().required("Fullname is required"),
    emailAddress: yup
        .string()
        .required("Email is required")
        .email("Please use a valid email address"),
    phoneNumber: yup.string().required("Phone Number is required"),
    gender: yup.string().required("Gender is required"),
})
export const eddTalentValidationSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    stageName: yup.string().required("Stage name is required"),
    industry: yup.string().required("Industry is required"),
    // phoneNumber: yup.string().required("Phone Number is required")
    // gender: yup.string().required("Gender is required"),
})

export const addTalentValidationSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),

    emailAddress: yup
        .string()
        .required("Email is required")
        .email("Please use a valid email address"),
    phoneNumber: yup.string().required("Phone Number is required"),
    gender: yup.string().required("Gender is required"),
    industry: yup.string().required("Industry is required"),
})

export const eventValidationSchema = yup.object().shape({
    eventTitle: yup.string().required("Event title is required"),
    description: yup.string().required("Description is required"),
    venue: yup
        .array()
        .of(
            yup.object().shape({
                eventVenue: yup.string().required("Event venue is required"),
                eventCity: yup.string().required("Event city is required"),
                eventCountry: yup
                    .object()
                    .required("Event country is required"),
                date: yup.string().required("Event date is required"),
                eventStartTime: yup.string().required("Start time is required"),
                eventEndTime: yup.string().required("End time is required"),
            })
        )
        .required("Event venue information is required"),
})

export const proposalInquiryValidationSchema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    emailAddress: yup
        .string()
        .required("Email is required")
        .email("Please use a valid email address"),
    phoneNumber: yup.string().required("Phone Number is required"),
    subject: yup.string().required("Subject is required"),
    description: yup.string().required("Description is required"),
})
export const bookingPersonalValidationSchema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    emailAddress: yup
        .string()
        .required("Email is required")
        .email("Please use a valid email address"),
    phoneNumber: yup.string().required("Phone Number is required"),
})
export const bookingEventValidationSchema = yup.object().shape({
    eventTitle: yup.string().required("Event title is required"),
    eventDate: yup
        .array()
        .of(
            yup.object().shape({
                eventVenue: yup.string().required("Event venue is required"),
                eventCity: yup.string().required("Event city is required"),
                eventCountry: yup
                    .object()
                    .required("Event country is required"),
                date: yup.string().required("Event date is required"),
                eventStartTime: yup.string().required("Start time is required"),
                eventEndTime: yup.string().required("End time is required"),
            })
        )
        .required("Event venue information is required"),
})
export const bookingDetailsValidationSchema = yup.object().shape({
    subject: yup.string().required("Subject is required"),
    description: yup.string().required("Description is required"),
})

export const invoiceValidationSchema = yup.object().shape({
    // Client Information
    clientName: yup
        .string()
        .required("Client name is required")
        .min(2, "Client name must be at least 2 characters"),

    clientEmail: yup
        .string()
        .email("Please enter a valid email address")
        .required("Client email is required"),

    clientLocation: yup.string().required("Client location is required"),

    clientPhoneNumber: yup
        .string()
        .required("Client phone number is required")
        .matches(/^[1-9][\d]{0,20}$/, "Please enter a valid phone number"),

    // Event Details
    eventType: yup.string().optional(),

    eventDate: yup
        .date()
        .required("Event date is required")
        .min(new Date(), "Event date cannot be in the past"),

    // Financial Information
    fees: yup
        .number()
        .required("Fees are required")
        .positive("Fees must be a positive number")
        .min(0.01, "Fees must be greater than 0"),

    billOption: yup.string().optional(),

    logisticsFee: yup
        .number()
        .min(0, "Logistics fee cannot be negative")
        .nullable()
        .transform((value, originalValue) => {
            // Handle empty string or null values
            return originalValue === "" ? null : value
        }),

    totalFee: yup
        .number()
        .required("Total fee is required")
        .positive("Total fee must be a positive number"),

    // Logistics
    logisticInformation: yup
        .string()
        .nullable()
        .max(500, "Logistics information cannot exceed 500 characters"),

    // Bank Details
    accountNumber: yup
        .string()
        .required("Account number is required")
        .matches(/^[0-9]+$/, "Account number must contain only numbers"),

    accountName: yup
        .string()
        .required("Account name is required")
        .min(2, "Account name must be at least 2 characters"),

    bankName: yup.string().required("Bank name is required"),

    // Additional Information
    additionalTC: yup
        .string()
        .nullable()
        .max(
            1000,
            "Additional terms and conditions cannot exceed 1000 characters"
        ),

    // Personal Information (seems to be talent/user info)
    fullName: yup
        .string()
        .required("Full name is required")
        .min(2, "Full name must be at least 2 characters"),

    phoneNumber: yup
        .string()
        .required("Phone number is required")
        .matches(/^[1-9][\d]{0,15}$/, "Please enter a valid phone number"),

    address: yup
        .string()
        .required("Address is required")
        .min(10, "Please provide a complete address"),

    email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),
})
