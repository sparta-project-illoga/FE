import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import './LikeButton.css';
import { useCookies } from 'react-cookie';

function LikeButton({ planId }) {
    const [isChecked, setIsChecked] = useState(false);
    const [cookies] = useCookies(['Authorization']);
    const token = cookies.Authorization.replace('Bearer ', ''); 
    //NOTE - cookies.Authorization?
    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            if (cookies.Authorization) { 
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/plan/${planId}/favorite/status`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }, withCredentials: true
                });
                setIsChecked(response.data.isFavorite);
            } catch (error) {
                console.error('좋아요 상태 가져오기 실패', error);
            }
        }
        }
            fetchFavoriteStatus();
        }, [planId, cookies.Authorization]);

    const toggleFavorite = async () => {

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/plan/${planId}/favorite`, {}, {
                headers: {
                Authorization: `Bearer ${token}`
                }, withCredentials: true
            });
            setIsChecked(!isChecked);
            } catch (error) {
            console.error('좋아요 변경 실패', error);
            }
        };

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