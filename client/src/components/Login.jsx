import React from "react";
import { useState, useEffect } from "react";
import "./login.css";
import axios from "axios";
import { Link } from "react-router-dom";
import gnulogo from '../images/gnulogo.png';
// import { cookies, setCookie, useCookies } from "react-cookie"
// import { setCookie, getCookie,removeCookie } from "./cookie";


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [isLogin, setIsLogin] = useState(false);
  // const [user, setUser] = useState({});
  
  const token = localStorage.getItem('login-token') || '';
  
  const login = async () => {
    try {
      if (username.trim() === '' || password.trim() === '') {
        alert('아이디 또는 비밀번호를 입력해주세요.');
        return;
      }
      const response = await axios({
        url: "http://localhost:8080/login",
        method: "POST",
        withCredentials: true,
        data: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (response.status === 200) {
        alert('로그인 되었습니다.')
        localStorage.setItem('login-token', response.headers.authorization);
        window.open('/', '_self');
      }
    } catch (error) {
      alert('등록되지 않은 아이디이거나 아이디 또는 비밀번호를\n잘못 입력했습니다.')
      console.log(error);
    }
  };


  useEffect(() => {
    try {
      axios({
        url: "http://localhost:8080/api/user/1", // user/success 에서 변경했는데 되긴함. 수정 필요
        method: "GET",
        withCredentials: true,
        headers: {
          'Authorization': token
        }
      })
        .then((res) => {
          if (res.data) {
            // setIsLogin(true);
            // setUser(res.data);
            console.log(res.data)
            console.log(token);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  
  // const accessToken = () => {
  //   axios({
  //     url: "http://localhost:8080/accesstoken",
  //     method: "GET",
  //     withCredentials: true,
  //   });
  // };

  // const refreshToken = () => {
  //   axios({
  //     url: "http://localhost:8080/refreshtoken",
  //     method: "GET",
  //     withCredentials: true,
  //   });
  // };
  return (
    <div className="auth-wrapper-container" style={{ display: 'flex' }}>
      <div className="second-auth">
            <form style={{ textAlign: 'center' }}> 
            <p style={{fontSize: '20px', textAlign: 'left'}}>" Effortlessly book your favorite sports facilities "</p>
              <img src={gnulogo} alt="GNU 로고" />
              <h1>GNU</h1>
              <h2>Sports Facility</h2><h2>Reservation </h2>
            </form>
      </div>

      <div className="auth-wrapper"  >
          <form>
            <h2 style={{fontSize: '40px',letterSpacing: '10px', color:"#50BDCF",textAlign: 'center'}}>LOGIN</h2>
                  <label>✉ Email</label>
            <input
              placeholder="email"
              className="inputValue"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />

            <label className="inputLabel" style={{ color: 'white', textDecoration: 'none' }}>password</label>
            <label>🔒 Password</label>
            <input
              type="password"
              placeholder="password"
              className="inputValue"
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

          <button onClick={login} type="button">Login</button><br/>
          <Link style={{ color: '#50BDCF', textDecoration: 'none', fontWeight: '800' }} to="/join">아직 아이디가 없으신가요?  </Link>
        </form>
      </div>



    </div>

  );
}