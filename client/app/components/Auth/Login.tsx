import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import * as Yup from 'yup';
import { styles } from '../../styles/style';


type Props = {
    setRoute: (route: string) => void;
    setOpen: (open: boolean) => void;
}
const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Please enter your email'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});
const Login: FC<Props> = ({ setRoute, setOpen }) => {
    const [show, setShow] = useState(false);
    const [login, { isSuccess, error }] = useLoginMutation();
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: schema,
        onSubmit: async ({ email, password }: { email: string; password: string }) => {
            await login({ email, password });
        }
    }
    );

    useEffect(() => {
        if (isSuccess) {
            setOpen(false);
            const message = "Login Successful";
            toast.success(message);
            setRoute("");
        }
        if (error) {
            if ("data" in error) {
                interface ErrorResponse {
                    data: { message: string };
                }
                const errorData = error as ErrorResponse;
                toast.error(errorData.data.message);
            } else {
                toast.error("An error occurred during login. Please try again.");
            }
        }
    }
        , [isSuccess, error]);
    const { errors, touched, values, handleChange, handleSubmit } = formik;
    return (
        <div className="w-full h-full flex flex-col justify-center">
            <h1 className={`${styles.title}`}>
                Login With Elearning
            </h1>
            <form onSubmit={handleSubmit}>
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
                    {
                        errors.password && touched.password && (
                            <span className="text-red-500 pt-2 black">{errors.password}</span>
                        )
                    }
                </div>
                <div className="w-full mt-5 text-black dark:text-white flex items-center justify-between">
                    <input type="submit"
                        value="Login"
                        className={`${styles.button}`} />
                </div>
                <br />
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                    Or Join with
                </h5>
                <div className="flex items-center justify-center my-3 text-black dark:text-white">
                    <FcGoogle size={30} className="cursor-pointer ml-2" onClick={() => { signIn("google") }} />
                    <AiFillGithub size={30} className="cursor-pointer ml-2" onClick={() => {
                        signIn("github");
                    }} />
                </div>
                <h5 className="dark:text-white text-black text-center pt-4 font-Poppins text-[14px]">
                    Not have an account?{" "}
                    <span className="text-[#2190ff] cursor-pointer"
                        onClick={() => setRoute && setRoute("Sign-Up")}>
                        Sign up
                    </span>

                </h5>
            </form>
            <br />
        </div>
    );
}

export default Login