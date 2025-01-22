import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Recommendation from "../components/Recommendation";
import {
  dislike,
  fetchFailure,
  fetchStart,
  fetchSuccess,
  like,
} from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import { format } from "timeago.js";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const Container = styled.div`
  display: flex;
  gap: 20px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;


const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);

  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchStart());
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        const channelRes = await axios.get(
          `/user/find/${videoRes.data.video.userId}`
        );
        setChannel(channelRes.data.user);
        dispatch(fetchSuccess(videoRes.data.video));
        setIsLoading(false);
      } catch (err) {
        dispatch(fetchFailure());
        setIsLoading(false);
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    try {
      await axios.put(`/users/like/${currentVideo._id}`);
      dispatch(like(currentUser._id)); // Update Redux state for user
      // Manually update the current video to reflect the new like count
      dispatch(
        fetchSuccess({
          ...currentVideo,
          likes: [...currentVideo.likes, currentUser._id],
        })
      );
    } catch (err) {
      console.error("Error liking video:", err);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.put(`/users/dislike/${currentVideo._id}`);
      dispatch(dislike(currentUser._id)); // Update Redux state for user
      // Manually update the current video to reflect the new dislike count
      dispatch(
        fetchSuccess({
          ...currentVideo,
          dislikes: [...currentVideo.dislikes, currentUser._id],
        })
      );
    } catch (err) {
      console.error("Error disliking video:", err);
    }
  };

  const handleSub = async () => {
    if (!currentUser) {
      console.error("User not logged in.");
      return;
    }

    try {
      if (currentUser.subscribedUsers?.includes(channel._id)) {
        await axios.put(`/users/unsub/${channel._id}`);
        dispatch(subscription(channel._id, "unsubscribe"));
      } else {
        await axios.put(`/users/sub/${channel._id}`);
        dispatch(subscription(channel._id, "subscribe"));
      }
    } catch (err) {
      console.error("Error handling subscription:", err);
    }
  };

  if (isLoading || !currentVideo) {
    return <div>Loading...</div>; // You can replace this with a spinner or loading animation.
  }
  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo.videoUrl} controls />
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>
            {currentVideo.views} views • {format(currentVideo.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "}
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>{currentVideo.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {currentUser?.subscribedUsers?.includes(channel._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id} />
      </Content>
      <Recommendation tags={currentVideo.tags} />
    </Container>
  );
};

export default Video;
