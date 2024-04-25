import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import './LikeButton.css';
import { useCookies } from 'react-cookie';

function LikeButton({ planId }) {
    const [isChecked, setIsChecked] = useState(false);
    const [cookies] = useCookies(['Authorization']);

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}:${process.env.API_PORT}/plan/${planId}/favorite/status`, {
                    headers: {
                        Authorization: cookies.Authorization
                    }, withCredentials: true
                });
                setIsChecked(response.data.isFavorite);
            } catch (error) {
                console.error('좋아요 상태 가져오기 실패', error);
            }
        };
            fetchFavoriteStatus();
        }, [planId, cookies.Authorization]);

    const toggleFavorite = async () => {

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}:${process.env.API_PORT}/plan/${planId}/favorite`, {}, {
                headers: {
                Authorization: cookies.Authorization
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