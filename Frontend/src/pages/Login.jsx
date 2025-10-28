import React, { useState } from 'react'
import { Link,  useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/auth.css'

const Login = () => {
    const [ form, setForm ] = useState({ email: '', password: '' });
    const [ submitting, setSubmitting ] = useState(false);
    const navigate = useNavigate();
    

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);


        console.log(form);

        axios.post("http://localhost:3000/api/auth/login", {
            email: form.email,
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
            <div className="auth-title">Welcome back</div>
            <div className="auth-sub">Sign in to continue — we keep it minimal and secure.</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" className="input" value={form.email} onChange={handleChange} type="email" required />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" className="input" value={form.password} onChange={handleChange} type="password" required />
          </div>

          <div className="actions">
            <Link to="/register" className="muted-link">Create account</Link>
            <button className="btn" type="submit">Sign in</button>
          </div>

          <div className="legal">By signing in you agree to our <a href="#" onClick={(e)=>e.preventDefault()} className="muted-link">terms</a>.</div>
        </form>
      </div>
    </div>
  )
}

export default Login
