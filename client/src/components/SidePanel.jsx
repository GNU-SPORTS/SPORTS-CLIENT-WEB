import Main from "./Main";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import Map from "./Map";
import Component1 from "./Map";
import { Button, Modal, Form, Container, Col, Row } from 'react-bootstrap';

function SidePanel() {
  const [isLogin, setIsLogin] = useState(false); //로그인 정보 저장
  const [user, setUser] = useState({});         // user 정보 저장
  const [reserveData, setReserveData] = useState([]); //예약데이터 정보 저장
  const [reservecenterId, setReservecenterId] = useState([]);   //예약ID 정보 저장
  const [reserveId, setReserveId] = useState([]);   //센터ID 정보 저장
  const [reservationInfo, setReservationInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);  //모달 열고 닫는 정보를 저장
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => { //예약모달창 열기 버튼함수
    setShowModal(true);
  };

  const handleCloseModal = () => { //예약모달창 닫기 버튼함수
    setShowModal(false);
  };

  let token = localStorage.getItem('login-token') || '';

  const logout = () => {
    // axios({
    //   url: "http://localhost:8080/logout",
    //   method: "POST",
    //   withCredentials: true,
    // }).then((res) => {
    //   if (res.status === 200) {
    //     window.open("/", "_self");
    //   }
    // });
    alert("로그아웃 되었습니다.")
    localStorage.clear()
    window.location.replace('http://localhost:3000/login')
  };

  useEffect(() => { // 로그인 여부와 사용자 정보 가져오기
    try {
      axios({
        url: "http://localhost:8080/user/success",
        method: "GET",
        withCredentials: true,
        headers: {
          'Authorization': token
        }
      })
        .then((res) => {
          if (res.data) {
            setIsLogin(true);
            setUser(res.data);
            console.log(res.data)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {  // 예약 데이터 가져오기
    try {
      axios({
        url: "http://localhost:8080/center/reservations",
        method: "GET",
        withCredentials: true,
        headers: {
          'Authorization': token
        }
      })
        .then((res) => {
          if (res.data && res.data.content) {   
            const reserveNames = res.data.content.map((item) => item.name); //예약된 체육시설을 이름 배열로 저장
            const ReserveIds = res.data.content.map((item) => item.reservationId); //예약된 ID를 배열로 저장
            const CenterIds = res.data.content.map((item) => item.centerId); //예약된 센터ID를 배열로 저장
            setReserveData(reserveNames);
            setReserveId(ReserveIds);
            setReservecenterId(CenterIds);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  function handleReservationClick(index) {    //사이드패널 예약목록 h6태그 클릭시 함수
    //예약된 체육시설 센터ID랑 예약ID 추출
    const centerId = reservecenterId[index];  
    const reservationId = reserveId[index];
    setShowModal(true);

    try {   //해당 체육시설 상세 예약정보 가져오기
      axios({
        url: `http://localhost:8080/center/${centerId}/reservation/${reservationId}`,
        method: "GET",
        withCredentials: true,
        headers: {
          'Authorization': token
        }
      })
        .then((res) => {
          setReservationInfo(res.data);
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = () => {   //삭제버튼 함수
    setLoading(true);
    const { centerId, reservationId } = reservationInfo;

      axios({
        url: `http://localhost:8080/center/${centerId}/reservation/${reservationId}`,
        method: "DELETE",
        withCredentials: true,
        headers: {
          'Authorization': token
        }
      })
      .then((res) => {
        console.log(res.data);
        window.location.reload();
        // 성공적으로 삭제되었을 때 추가적인 작업 수행
        // 예를 들어, 삭제된 예약 정보를 갱신하거나 목록을 새로고침하는 등의 동작을 수행할 수 있습니다.
      })
      .catch((error) => {
        console.log(error);

        // 삭제 실패 시 에러 처리 로직 추가
      })
      .finally(() => {
        setLoading(false);
        setShowModal(false); // 모달 창 닫기
      });
    }

  return (
    <div
      style={{
        backgroundColor: "#b4fedb",
        width: "22vw",
        padding: '2rem',
        minHeight: '115%',
        color: '#5a635f',
        minWidth: '100%',
        borderRadius: '20px',
        marginLeft: '20px',
      }}>
      <h2 id="sidepaneltitle" style={{ fontWeight: '600' }}>
        🏫 경상국립대학교<br />체육시설 예약 사이트
      </h2>
      <h4 style={{ marginTop: '20px' }}>
        ⛹️‍♂️ {user.username} 님
        <button onClick={logout} style={{ backgroundColor: "white", borderRadius: '20px', fontSize: '15px', border: 'none', color: '#5a635f', float: 'right', padding: '0.5rem', cursor: 'pointer' }}>Logout</button>
      </h4><br />
      <h4>⚽ 나의 예약현황 <p style={{ fontSize: "15px", marginLeft: '25px' }}>(최대 20개까지만 표시)</p></h4>
      {reserveData.map((name, index) => (
        <h6 key={index} style={{ marginLeft: '30px', cursor: "pointer" }} onClick={() => handleReservationClick(index)}>{index + 1}. {name}</h6>
      ))}
      <Container>
          <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>예약 상세 정보</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
              {reservationInfo ? (
                    <Form>
                      <Form.Group className="mb-3">
                        {reservationInfo && reservationInfo.imgUrl && (
                          <img src={reservationInfo.imgUrl} style={{width: '465px', height: '280px', borderRadius: '10px'}}/>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>✔ 시설명 : {reservationInfo && reservationInfo.name}</Form.Label>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>✔ 내가 예약한 시간 : {(reservationInfo && reservationInfo.reservingTime).join(", ")}
                        </Form.Label>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>✔ 가격 : {reservationInfo && reservationInfo.price}원</Form.Label>
                      </Form.Group>
                    </Form>
                    ) : (
                    <p>Loading reservation information...</p>
                  )}
          
              </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
              {loading ? '삭제 중...' : '삭제하기'}
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              닫기
            </Button>

          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  )
}

export default SidePanel;
