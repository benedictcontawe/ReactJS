import React, { useRef } from 'react'
import './LoginPage.css'

const LoginPage = () => {
    const nameRef = useRef(null)
    const phoneRef = useRef(null)
    const handleSubmit = (event) => {
        event.preventDefault();
        const user = {
            name: "",
            phone: 0
        };
        user.name = (nameRef.current.value);
        user.phone = parseInt(phoneRef.current.value)
        console.log(user);
    }
  return (
    <section className='align_center form_page'>
        <form className='authentication_form' onSubmit={handleSubmit}>
            <h2>Login Form</h2>
            <div className='form_inputs'>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type='text' ref={nameRef} id='name' className='form_text_input' placeholder='Enter your name' />
                </div>
                <div>
                    <label htmlFor='phone'>Phone Number</label>
                    <input type='number' ref={phoneRef}  id='phone' className='form_text_input' placeholder='Enter your phone number' />
                    <button type='button' onClick={() => phoneRef.current.type= "password"} >Hide Number</button>
                    <button type='button' onClick={() => phoneRef.current.type= "number"} >Show Number</button>
                </div>
                <button type='submit' className='search_button form_submit'>Submit</button>
            </div>
        </form>
    </section>
  )
}

export default LoginPage