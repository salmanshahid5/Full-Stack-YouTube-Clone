import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  flex-wrap: wrap;
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/videos/${type}`);
        console.log("Fetched videos:", res.data.videos);
        setVideos(Array.isArray(res.data.videos) ? res.data.videos : []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]); // In case of an error, ensure videos is an empty array
      }
    };

    fetchVideos(); // Call the function inside useEffect
  }, [type]); // Dependency array to re-fetch if `type` changes

  return (
    <Container>
      {videos.length > 0 ? (
        videos.map((video) => <Card key={video._id} video={video} />)
      ) : (
        <div>No videos available</div> // Handle empty state
      )}
    </Container>
  );
};

export default Home;
