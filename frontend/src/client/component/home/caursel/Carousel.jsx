import React from 'react'
import { Typography, Box, Skeleton } from '@mui/material'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from 'axios'
import { baseApi } from '../../../../environment.js'


export default function Carousel() {
  const [schools, setSchools] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchSchools = () => {
    axios.get(`${baseApi}/school/all`)
      .then(res => {
        setSchools(res.data.schools);
        setLoading(false);
      }).catch(error => {
        console.error(
          `%c[ERROR in Fetching School]:- ${error.name || "Unknown Error"} `,
          "color: red; font-weight: bold; font-size: 14px;", error
        );
        setLoading(false);
      })
  }

  React.useEffect(() => {
    fetchSchools();
  }, [])

  return (
    <>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          style={{ width: "100%", height: "70vh", minHeight: "400px" }}
        >
          {loading
            ? [...Array(3)].map((_, index) => (
              <SwiperSlide key={index}>
                <Skeleton variant='rectangular' width='100%' height='70vh' sx={{ minHeight: '400px' }} />
              </SwiperSlide>
            ))
            : schools.map((school, index) => (
              <SwiperSlide key={index}>
                <Box sx={{ position: "relative", textAlign: "center", color: "white" }}
                >
                  <img
                    src={`${school.school_image}?w=248&fit=crop&auto=format`}
                    alt={school.school_name}
                    style={{ width: "100%", height: "70vh", minHeight: "400px", objectFit: "cover" }}
                  />
                  <Box sx={{
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    padding: "10px 20px",
                    borderRadius: 1,
                  }}
                  >
                    <Typography variant="h5">{school.school_name}</Typography>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
        </Swiper>
      </Box>
    </>
  )
}
