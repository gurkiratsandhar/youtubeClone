import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Stack } from "@mui/material";
import { CheckCircle, Title } from "@mui/icons-material";
import { Videos } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import React from "react";
import { InfinitySpin } from "react-loader-spinner";

const VideoDetail = () => {
  const [videoDetail, setvideoDetail] = useState(null);
  const { id } = useParams();
  const [loading, setloading] = useState(true);
  const [videos, setvideos] = useState(null);

  useEffect(() => {
    fetchFromAPI(`videos?part=snippet%2Cstatistics&id=${id}`).then((info) =>
      setvideoDetail(info.items[0])
    );
    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`).then(
      (data) => setvideos(data.items)
    );
    setTimeout(() => {
      setloading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <Box
        minHeight="95vh"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <InfinitySpin color="white" height="200px" width="200px" />
      </Box>
    );
  } else {
    const {
      snippet: { title, channelId, channelTitle },
      statistics: { viewCount, likeCount },
    } = videoDetail;

    return (
      <Box minHeight="95vh">
        <Stack direction={{ xs: "column", md: "row" }}>
          <Box flex={1}>
            <Box sx={{ width: "100%", position: "sticky", top: "86px" }}>
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${id}`}
                className="react-player"
                controls
              />
              <Typography color="#FFF" variant="h5" fontWeight="bold" p={2}>
                {title}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ color: "#fff" }}
                py={1}
                px={2}
              >
                <Link to={`/channel/${channelId}`}>
                  <Typography variant="body1" color="#fff" fontWeight="bold">
                    {channelTitle}
                    <CheckCircle
                      sx={{ fontSize: "12px", color: "gray", ml: "5px" }}
                    />
                  </Typography>
                </Link>
                <Stack direction="row" gap="20px" alignItems="center">
                  <Typography variant="body1" sx={{ opacity: 0.7 }}>
                    {parseInt(viewCount).toLocaleString()} views
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.7 }}>
                    {parseInt(likeCount).toLocaleString()} likes
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
          <Box
            px={2}
            py={{ md: 1, xs: 5 }}
            justifyContent="center"
            alignItems="center"
          >
            <Videos videos={videos} direction="column" />
          </Box>
        </Stack>
      </Box>
    );
  }
};

export default VideoDetail;
