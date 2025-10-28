import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'
import axios from 'axios'

const Register = () => {
  const [form, setForm] = useState({ email: '', firstname: '', lastname: '', password: '' })
    const [ submitting, setSubmitting ] = useState(false);
      const navigate = useNavigate();
      
  // const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

   function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);


        console.log(form);

        axios.post("http://localhost:3000/api/auth/register", {
            email: form.email,
            fullName:{
              firstname: form.firstname,
              lastname: form.lastname,
            },
            password: form.password
        },
            {
                withCredentials: true
            }
        ).then((res) => {
            console.log(res);
            navigate("/");
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setSubmitting(false);
        });

    }

  return (
    <div className="auth-wrap app-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-dot" />
          <div>
            <div className="auth-title">Create your account</div>
            <div className="auth-sub">Fast, seameless sign up — mobile first and responsive.</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" className="input" value={form.email} onChange={handleChange} type="email" required />
          </div>

          <div className="input-row">
            <div className="field">
              <label htmlFor="firstname">First name</label>
              <input id="firstname" name="firstname" className="input" value={form.firstname} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="lastname">Last name</label>
              <input id="lastname" name="lastname" className="input" value={form.lastname} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" className="input" value={form.password} onChange={handleChange} type="password" required />
          </div>

          <div className="actions">
            <a className="muted-link" href="#" onClick={(e)=>e.preventDefault()}>Need help?</a>
            <button className="btn" type="submit">Create account</button>
          </div>

          <div className="legal">Already have an account? <Link to="/login" className="muted-link">Sign in</Link></div>
        </form>
      </div>
    </div>
  )
}

export default Register
