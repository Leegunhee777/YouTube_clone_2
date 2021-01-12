import React, { useEffect, useState,useSelector } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from 'antd'; //반응형으로 만들때 유용함
import axios from 'axios';
import moment from 'moment'; //날자출력 포맷을 정해주기 위해사용
const { Title } = Typography;
const { Meta } = Card;


function SubscriptionPage({user}) {
    
    const [Videos, setVideos] = useState([])
    
    useEffect(() => {
            //console.log('user란');//app.js의 Auch함수에 의해 렌더되는 모든 컴포넌트에서 로그인정보에 대한 user(서버에서받아온 리덕스값과연동)값 쓸수있음
            //console.log(user);
                           //주의!!!!!!!!
        if(user.userData){  //가끔은 상위컴토넌트의값을 Props로 온전히 받아오기도 전에 , 렌더가진행되어 undefined가 뜨는경우가있다. 그럴땐 if을이용해 통제역할을 해주면 undefined되는 에러를 막을수있다!!!
                            //추가적으로 useEffect()의 [user]로해줘야함. Why? []을사용하면 useEffect가 처음렌더된후에 딱한번만실행되기때문에, 값을온전히 받아오기도 전에 useEffect가 한번실행되고끝남
                            //허나 [user]을하면 처음렌더링될때문만아니라, props의값(user값)변화로인해 재랜더링이 일어날떄마다!! 실행될수있기때문이다.
                            //요약: []을해놓으면 처음렌더링될떄 딱한번만 실행되므로 상위컴포넌트를통해온 props가 온전히 값을 받기전에 useEffect가실행되어, user찍어보면 undefined가뜬다.
                            //허나 [user]을하면 처음렌더링될때뿐아니라, user값(props값)의변화로인한 재렌더링될떄마다 실행되므로,  
                            // user를 콘솔찍어보면: 1. prop값온전히 받기전 user: undefiled 첫번째출력 -> 2. props값온전히받은후 user(props값의변화에의해 재렌더링): 온전한 user값받은후 두번째출력 
                const subscriptionVariables = {
                giveUser:  user.userData._id
                }
          
                axios.post('/api/video/getSubscriptionVideos',subscriptionVariables)
                    .then(response => {
                        if (response.data.success) {
                            console.log(response.data.videos)
                            setVideos(response.data.videos)
                        } else {
                        alert('Failed to get Videos')
                        }
            })
        }
        
    },[user])





    const renderCards = Videos.map((video, index) => {
        return <Col key= {index} lg={6} md={8} xs={48}>
            <div  style={{ position: 'relative' }}>
                <a href={`/video/${video._id}`} >
                    <video style={{width:'100%' ,height:'200px'}}src={`http://localhost:5000/${video.filePath}`} controls={false}/>
                </a>
            </div>
            <br />
            <Meta
                avatar={<Avatar src={video.writer.image} />}
                title={video.title}
            />
            <span>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}> {video.views}</span>
            - <span> {moment(video.createdAt).format("MMM Do YYYY")} </span>
        </Col>

    })



    return (
        <div style={{width: '80%', margin: '5rem auto'}}>
        <Title level={2} >Recommended</Title>
         <hr/>
         <Row gutter={16}>
           
           {renderCards}
         
         </Row>
    </div>
    )
}

export default SubscriptionPage
