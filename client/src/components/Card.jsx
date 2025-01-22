import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import Loading from "./Loading";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "315px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #999;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ video, type }) => {
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`user/find/${video.userId}`);
        console.log("Channel API Response:", res.data);
        if (res.data && res.data.user) {
          setChannel(res.data.user);
        } else {
          console.warn("Unexpected response format:", res.data);
          setChannel({ name: "Unknown", img: "" }); // Fallback data
        }
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setChannel({ name: "Unknown", img: "" }); // Fallback data
      }
    };
  
    fetchChannel();
  }, [video.userId]);
  

  return (
    channel ? (
      <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
        <Container type={type}>
          <Image type={type} src={video.imgUrl} alt={video.title} />
          <Details type={type}>
            <ChannelImage type={type} src={channel.img} alt={channel.name} />
            <Texts>
              <Title>{video.title}</Title>
              <ChannelName>{channel.name}</ChannelName>
              <Info>{video.views} views • {format(video.createdAt)}</Info>
            </Texts>
          </Details>
        </Container>
      </Link>
    ) : (
      <Container>
        <Loading type={type} />
      </Container>
    )
  );
};

export default Card;
