import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
  flex: 2;
`;

const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const trimmedTags = tags.map(tag => tag.trim()); // Trim tags
        const res = await axios.get(`/videos/tags?tags=${trimmedTags.join(",")}`);
        console.log("Fetching videos with tags:", trimmedTags);
        setVideos(res.data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]); // Default to empty array in case of error
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos()   
  }, [tags]);

  return (
    <Container>
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Recommendation;
