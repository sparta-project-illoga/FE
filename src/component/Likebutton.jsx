// import React from 'react';
// import axios from 'axios';
// import {HeartOutlined, HeartFilled} from '@ant-design/icons';
// import './LikeButton.css'
// import { Cookies } from 'react-cookie';

// class LikeButton extends React.Component{
//     state = {
//         isChecked: false,
//         notice: ' ',
//     };

    // toggleFavorite = async () => {
    //     const { planId } = this.props; // props에서 planId 추출
    //     console.log(planId)
    //     const cookies = new Cookies()
    //     const token = cookies.get('Authorization');
    //     console.log(token)
    //     try {
    //         await axios.post(`http://localhost:3000/plan/${planId}/favorite`, {}, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //         this.setState(prevState => ({ isChecked: !prevState.isChecked }));
    //         console.log(token)
    //     } catch (error) {
    //         console.error('좋아요 변경 실패', error);
    //     }
    // }

//     onClick = () => {
//         this.state.isChecked ?
//         this.setState({
//             isChecked: false,
//             notice: '',
//         })
//         :
//         this.setState({
//             isChecked: true,
//         });
//     }
//     render(){
//         return(
//             <React.Fragment>
//                 <div className="icons-list">
//                     {this.state.isChecked ?  
//                     <HeartFilled className="button red" onClick={this.onClick}/> :
//                     <HeartOutlined className="button" onClick={this.onClick}/>}
//                 </div>
//             </React.Fragment> 
//         )
//     }
// }
// export default LikeButton;

import React, { useState } from 'react';
import axios from 'axios';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import './LikeButton.css';
import { Cookies } from 'react-cookie';

function LikeButton({ planId }) {
    const [isChecked, setIsChecked] = useState(false);
    console.log(planId)

    const toggleFavorite = async () => {
        const cookies = new Cookies();
        const token = cookies.get('Authorization');

        try {
            await axios.post(`http://localhost:3000/plan/${planId}/favorite`, {}, {
                headers: {
                Authorization: token
                }, withCredentials: true
            });
            setIsChecked(!isChecked);
            } catch (error) {
            console.error('좋아요 변경 실패', error);
            }
        };
        console.log('planId:', planId)

    // const onClick = () => {
    //     setIsChecked(!isChecked);
    // };

    return (
        <>
        <div className="icons-list">
            {isChecked ? (
            <HeartFilled className="button red" onClick={toggleFavorite} />
            ) : (
            <HeartOutlined className="button" onClick={toggleFavorite} />
            )}
        </div>
        </>
    );
}

export default LikeButton;