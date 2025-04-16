import { LoadingState, Switch } from "@components/index"
import {
    fetchNotificationSettings,
    updateNotificationSettings,
} from "@services/auth"
import { useQuery } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../../type/api/index"
import { useState, useEffect } from "react"
import { registerServiceWorker, subscribeUser, unsubscribeUser } from "@contexts/pushNotifications"

const NotificationSettings = () => {
    const queryClient = useQueryClient()

    const [isChecked, setIsChecked] = useState(false)
    const [isChecked1, setIsChecked1] = useState(false)
    const [isChecked2, setIsChecked2] = useState(false)
    const [isChecked3, setIsChecked3] = useState(false)
    const [isChecked4, setIsChecked4] = useState(false)
    const [isChecked5, setIsChecked5] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ["notificationSettings"],
        queryFn: () => fetchNotificationSettings(),
    })
    useEffect(() => {
        if (data) {
            setIsChecked(data.data.emailNotification ?? false)
            setIsChecked4(data.data.eventsNotification ?? false)
            setIsChecked2(data.data.inquiriesNotification ?? false)
            setIsChecked1(data.data.messagesSMSNotification ?? false)
            setIsChecked3(data.data.productTipAndPromotionNotification ?? false)
        }
    }, [data?.data])

    useEffect(() => {
        const checkPushSubscription = async () => {
            if ("serviceWorker" in navigator) {
                const registration = await navigator.serviceWorker.ready;
                const existingSubscription = await registration.pushManager.getSubscription();
                setIsChecked5(!!existingSubscription);
            }
        };

        checkPushSubscription();
    }, []);

    const handlePushNotificationChange = async () => {
        try {
          const registration = await registerServiceWorker();
      
          if (registration) {
            if (isChecked5) {
              await unsubscribeUser(registration);
            } else {
              await subscribeUser(registration);
            }
            setIsChecked5(!isChecked5);
          } else {
            console.error("Service Worker registration failed");
          }
        } catch (error) {
          console.error("Error handling push notification change:", error);
          setIsChecked5(prev => !prev);
        }
      };
      

    const {  mutate } = useMutation({
        mutationFn: updateNotificationSettings,
        onSuccess: ({ data }) => {
            queryClient
                .invalidateQueries({
                    queryKey: ["notificationSettings"],
                })
                .finally(() => false)
            showNotification({
                title: "Success",
                message: data.message,
                color: "green",
            })
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    return (
        <div>
            {isLoading ? (
               <LoadingState />
            ) : (
                <>
                    <div className="flex items-center justify-between border-b p-4 sm:mr-4">
                        <div>
                            <p className="text-md font-medium">
                                Email Notification
                            </p>
                            <p className="text-md mt-2">
                                send you notifications via email
                            </p>
                        </div>
                        <div className="ml-2">
                            <Switch
                                value=""
                                checked={isChecked}
                                onChange={() => {
                                    setIsChecked(!isChecked)
                                    data?.data.emailNotification === true
                                        ? mutate({ emailNotification: false })
                                        : mutate({ emailNotification: true })
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-b p-4 sm:mr-4">
                        <div>
                            <p className="text-md font-medium">Messages</p>
                            <p className="text-md mt-2">
                                Send me all message notification received on the
                                app
                            </p>
                        </div>
                        <div className="ml-2">
                            <Switch
                                value=""
                                checked={isChecked1}
                                onChange={() => {
                                    setIsChecked1(!isChecked1)
                                    data?.data.messagesSMSNotification === true
                                        ? mutate({
                                              messagesSMSNotification: false,
                                          })
                                        : mutate({
                                              messagesSMSNotification: true,
                                          })
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-b p-4 sm:mr-4">
                        <div>
                            <p className="text-md font-medium">Inquiries</p>
                            <p className="text-md mt-2">
                                Send me all inquiry notifications received on
                                the app
                            </p>
                        </div>
                        <div className="ml-2">
                            <Switch
                                value=""
                                checked={isChecked2}
                                onChange={() => {
                                    setIsChecked2(!isChecked2)
                                    data?.data.inquiriesNotification === true
                                        ? mutate({
                                              inquiriesNotification: false,
                                          })
                                        : mutate({
                                              inquiriesNotification: true,
                                          })
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-b p-4 sm:mr-4">
                        <div>
                            <p className="text-md font-medium">
                                Products Tips and promotions
                            </p>
                            <p className="text-md mt-2">
                                Send me occasional emails with updates and
                                promotions from Husridge
                            </p>
                        </div>
                        <div className="ml-2">
                            <Switch
                                value=""
                                checked={
                                    isChecked3
                                }
                                onChange={() => {
                                    setIsChecked3(!isChecked3)
                                    data?.data
                                        .productTipAndPromotionNotification ===
                                    true
                                        ? mutate({
                                              productTipAndPromotionNotification:
                                                  false,
                                          })
                                        : mutate({
                                              productTipAndPromotionNotification:
                                                  true,
                                          })
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-b p-4 sm:mr-4">
                        <div>
                            <p className="text-md font-medium">Events</p>
                            <p className="text-md mt-2">
                                Send me all events notification via email
                            </p>
                        </div>
                        <div className="ml-2">
                            <Switch
                                value=""
                                checked={isChecked4}
                                onChange={() => {
                                    setIsChecked4(!isChecked4)
                                    data?.data.eventsNotification === true
                                        ? mutate({ eventsNotification: false })
                                        : mutate({ eventsNotification: true })
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-b p-4 sm:mr-4">
                        <div>
                            <p className="text-md font-medium">Push Notifications</p>
                            <p className="text-md mt-2">
                                Send me push notifications on this device
                            </p>
                        </div>
                        <div className="ml-2">
                            <Switch
                                value=""
                                checked={isChecked5}
                                onChange={handlePushNotificationChange}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default NotificationSettings
