import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import * as Yup from 'yup';
import { styles } from '../../styles/style';
type Props = {
    setRoute: (route: string) => void;
}
const schema = Yup.object().shape({
    name: Yup.string().required('Please Enter Your Name!'),
    email: Yup.string().email('Invalid email address').required('Please enter your email'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});
const SignUp: FC<Props> = ({ setRoute }) => {
    const [show, setShow] = useState(false);
    const [register, { data, error, isSuccess }] = useRegisterMutation();
    useEffect(() => {
        if (isSuccess) {
            const message = data?.message || "Registration Successfull";
            toast.success(message);
            setRoute("Verification");
        }
        if (error) {
            if ("data" in error) {
                interface ErrorResponse {
                    data: { message: string };
                }
                const errorData = error as ErrorResponse;
                toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error]);


    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: ""
        },
        validationSchema: schema,
        onSubmit: async ({ name, email, password }: { name: string; email: string; password: string }) => {
            const data = {
                name, email, password
            };
            await register(data);
        }
    }
    );
    const { errors, touched, values, handleChange, handleSubmit } = formik;
    return (
        <div className="w-full">
            <h1 className={`${styles.title}`}>
                Join to Elearning
            </h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className={`${styles.label}`} htmlFor="email">
                        Enter Your name
                    </label>
                    <input
                        type="name"
                        name=""
                        id="name"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="johndoe"
                        className={`${errors.email && touched.email && "border-red-500"}
               ${styles.input}`} />
                    {
                        errors.name && touched.name && (
                            <span className="text-red-500 pt-2 black">{errors.name}</span>
                        )
                    }
                </div>
                <label className={`${styles.label}`} htmlFor="email">
                    Enter Your Email
                </label>
                <input
                    type="email"
                    name=""
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className={`${errors.email && touched.email && "border-red-500"}
               ${styles.input}`} />
                {
                    errors.email && touched.email && (
                        <span className="text-red-500 pt-2 black">{errors.email}</span>
                    )
                }
                <div className="w-full mt-5 relative mb-1">
                    <label htmlFor="email" className={`${styles.label}`}>
                        Enter Your Password
                    </label>
                    <input type={!show ? "password" : "text"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        id="password"
                        placeholder="password!@%"
                        className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`} />
                    {
                        !show ? (
                            <AiOutlineEyeInvisible
                                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                                onClick={() => setShow(true)}
                                size={20}
                            />
                        ) : (
                            <AiOutlineEye
                                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                                onClick={() => setShow(false)}
                                size={20}
                            />
                        )
                    }

                </div>
                {
                    errors.password && touched.password && (
                        <span className="text-red-500 pt-2 black">{errors.password}</span>
                    )
                }
                <div className="w-full mt-2">
                    <input type="submit"
                        value="Sign Up"
                        className={`${styles.button} cursor-pointer`} />
                </div>
                <br />
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                    Or Join with
                </h5>
                <div className="flex items-center justify-center my-3 text-black dark:text-white">
                    <FcGoogle size={30} className="cursor-pointer ml-2" onClick={async () => {
                        try {
                            await signIn("google");
                        } catch (error: unknown) {
                            const err = error as { message?: string };
                            if (err?.message?.includes('client_fetch_error')) {
                                toast.error("Authentication service is currently unavailable. Please try again later.");
                            } else {
                                toast.error("An unexpected error occurred during sign in.");
                            }
                        }
                    }} />
                    <AiFillGithub size={30} className="cursor-pointer ml-2" onClick={async () => {
                        try {
                            await signIn("github");
                        } catch (error: unknown) {
                            const err = error as { message?: string };
                            if (err?.message?.includes('client_fetch_error')) {
                                toast.error("Authentication service is currently unavailable. Please try again later.");
                            } else {
                                toast.error("An unexpected error occurred during sign in.");
                            }
                        }
                    }} />
                </div>
                <h5 className="text-black dark:text-white text-center pt-4 font-Poppins text-[14px]">
                    Already have an account?{" "}
                    <span className="text-[#2190ff] cursor-pointer"
                        onClick={() => setRoute && setRoute("Login")}>
                        Sign in
                    </span>

                </h5>
            </form>
            <br />
        </div>
    );
}

export default SignUp;