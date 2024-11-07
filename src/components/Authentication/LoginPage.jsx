import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import './LoginPage.css';
import { login, getUser } from '../../Network/userServices';
import { useLocation, Navigate } from 'react-router-dom';

const schema = z.object({
    email: z.string().email({ message: "Please enter valid email address." }).min(3),
    password: z.string().min(8, { message: "Password should be at least 8 characters." })
})

const LoginPage = () => {
    const [error, setError] = useState("")
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm({resolver: zodResolver(schema)})
    const onSubmit = async (formData) => {
        console.log("LoginPage", "onSubmit", formData)
        setError("")
        login(formData.email, formData.password)
        .then(response => {
            const { state } = location
            console.log("LoginPage", 'Login successful:', response.data, state);
            window.location = state ? state.form : "/";
        }).catch((error) => {
            console.error("LoginPage", 'Login error:', error.response.data);
            if(error.response && error.response.status === 400)
                setError(error.response.data.message)
        });
    }
    console.log("LoginPage", location)
    if (getUser()) {
        return <Navigate to='/' />;
    }
    return (
    <section className='align_center form_page'>
        <form className='authentication_form' onSubmit={handleSubmit(onSubmit)} >
            <h2>Login Form</h2>
            <div className='form_inputs'>
                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                        type='email' 
                        id='email' 
                        className='form_text_input' 
                        placeholder='Enter your email address' 
                        {...register("email") } />
                        { errors.email && <em className="form_error">{errors.email.message}</em> }
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input 
                        type='password'   
                        id='password' 
                        className='form_text_input' 
                        placeholder='Enter your password'
                        { ...register("password") } />
                        { errors.password && <em className="form_error">{errors.password.message}</em> }
                </div>
                {error && <em className='form_error'>{error}</em>}
                <button type='submit' className='search_button form_submit'>Submit</button>
            </div>
        </form>
    </section>
    )
}

export default LoginPage