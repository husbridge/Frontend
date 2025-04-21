import { Stepper, rem } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import AccountInformation from "./components/accountInformation"
import AlreadyHaveAnAccount from "./components/AlreadyHaveAnAccount"
import LeftBackground from "./components/leftBackground"
import TalentInformation from "./components/talentInformation"
import VerificationInformation from "./components/verificationInformation"

const TalentSignUp = () => {
    const location = useLocation()
    const matches = useMediaQuery("(min-width: 1100px)")
    const matches1 = useMediaQuery("(min-width: 630px)")
    const matches2 = useMediaQuery("(min-width: 768px)")
    const matches3 = useMediaQuery("(min-width: 500px)")
    const matches4 = useMediaQuery("(min-width: 550px)")
    const [active, setActive] = useState(location.state?.key || 0)

    return (
        <main className="flex">
            <div className="md:block hidden">
                <LeftBackground />
            </div>
            <div className="bg-white-100 md:p-20 p-6 mx-auto">
                <Stepper
                    active={active}
                    onStepClick={setActive}
                    color="rgba(0, 0, 0, 0.20)"
                    styles={{
                        separator: {
                            marginLeft: rem(-2),
                            marginRight: rem(-2),

                            //height: rem(10),
                        },
                        step: {
                            padding: 0,
                        },
                        steps: {
                            paddingRight: matches2 ? 0 : 30,
                        },
                        stepIcon: {
                            background: "#E1E1E1 ",
                            borderColor: "#E1E1E1",
                        },
                        stepCompletedIcon: {
                            color: "black",
                        },

                        stepBody: {
                            position: "absolute",
                            marginTop: 100,

                            marginLeft: -20,
                        },
                        stepLabel: {
                            textWrap: "wrap",
                            padding: matches ? 0 : "10px",

                            width: matches ? "100%" : 20,
                        },
                        stepDescription: {},
                        root: {
                            width: matches
                                ? "100vh"
                                : matches2
                                  ? "60vh"
                                  : matches1
                                    ? "90vh"
                                    : matches4
                                      ? "78vh"
                                      : matches3
                                        ? "69vh"
                                        : "100%",
                        },
                    }}
                >
                    <Stepper.Step
                        completedIcon="1"
                        progressIcon={
                            <p className="bg-black-100 text-yellow-100 w-full  h-full rounded-full text-center flex place-items-center justify-center">
                                1
                            </p>
                        }
                        label="Account information"
                    >
                        <AccountInformation userType="talent" />
                    </Stepper.Step>
                    <Stepper.Step
                        completedIcon="2"
                        label="Talent information"
                        progressIcon={
                            <p className="bg-black-100 text-yellow-100 w-full  h-full rounded-full text-center flex place-items-center justify-center">
                                2
                            </p>
                        }
                    >
                        <TalentInformation handleClick={() => setActive(2)} />
                    </Stepper.Step>
                    <Stepper.Step
                        completedIcon="3"
                        label="Personal information"
                        progressIcon={
                            <p className="bg-black-100 text-yellow-100 w-full  h-full rounded-full text-center flex place-items-center justify-center">
                                3
                            </p>
                        }
                    >
                        <VerificationInformation />
                    </Stepper.Step>
                </Stepper>
                <AlreadyHaveAnAccount />
            </div>
        </main>
    )
}

export default TalentSignUp
