import React from 'react';
import axios from 'axios';
import {HeartOutlined, HeartFilled} from '@ant-design/icons';
import './LikeButton.css'
import { Cookies } from 'react-cookie';

class LikeButton extends React.Component{
    state = {
        isChecked: false,
        // notice: ' ',
    };

    toggleFavorite = async () => {
        const { planId } = this.props; // props에서 planId 추출
        const token = Cookies.Authorization;
        try {
            await axios.post(`http://localhost:3000/plan/${planId}/favorite`);
            this.setState(prevState => ({ isChecked: !prevState.isChecked }));
        } catch (error) {
            console.error('좋아요 변경 실패', error);
        }
    }

    // onClick = () => {
    //     this.state.isChecked ?
    //     this.setState({
    //         isChecked: false,
    //         notice: '',
    //     })
    //     :
    //     this.setState({
    //         isChecked: true,
    //     });
    // }
    render(){
        return(
            <React.Fragment>
                <div className="icons-list">
                    {this.state.isChecked ?  
                    <HeartFilled className="button red" onClick={this.toggleFavorite}/> :
                    <HeartOutlined className="button" onClick={this.toggleFavorite}/>}
                </div>
            </React.Fragment> 
        )
    }
}
export default LikeButton;