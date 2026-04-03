import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"

import { FaStar } from "react-icons/fa"
import { Autoplay, Pagination } from "swiper"

import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])

  // 🔥 Dummy Reviews
  const dummyReviews = [
    {
      _id: "1",
      user: {
        firstName: "Rahul",
        lastName: "Sharma",
        image: "https://i.pravatar.cc/150?img=3",
      },
      course: { courseName: "Web Development Bootcamp" },
      rating: 5,
      review: "This course is amazing! Everything is explained clearly.",
    },
    {
      _id: "2",
      user: {
        firstName: "Priya",
        lastName: "Singh",
        image: "https://i.pravatar.cc/150?img=5",
      },
      course: { courseName: "React Mastery" },
      rating: 4,
      review: "Very helpful content and beginner friendly.",
    },
    {
      _id: "3",
      user: {
        firstName: "Amit",
        lastName: "Verma",
        image: "https://i.pravatar.cc/150?img=8",
      },
      course: { courseName: "MERN Stack Course" },
      rating: 5,
      review: "Best course I have taken so far!",
    },
    {
      _id: "4",
      user: {
        firstName: "Sneha",
        lastName: "Patel",
        image: "https://i.pravatar.cc/150?img=9",
      },
      course: { courseName: "JavaScript Essentials" },
      rating: 4.5,
      review: "Great explanations and real-world examples.",
    },
  ]

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )

        if (data?.success && data?.data?.length > 0) {
          setReviews(data.data)
        } else {
          setReviews(dummyReviews)
        }
      } catch (error) {
        setReviews(dummyReviews)
      }
    })()
  }, [])

  return (
    <div className="text-white w-11/12 max-w-maxContent mx-auto my-16">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Reviews from other learners
      </h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        loop={true}
        centeredSlides={true}
        grabCursor={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review._id}>
            <div className="bg-richblack-800 p-5 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 h-[220px] flex flex-col justify-between">
              
              {/* USER */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    review?.user?.image ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                  }
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />

                <div>
                  <p className="font-semibold text-richblack-5 text-sm">
                    {review?.user?.firstName} {review?.user?.lastName}
                  </p>
                  <p className="text-xs text-richblack-400">
                    {review?.course?.courseName}
                  </p>
                </div>
              </div>

              {/* REVIEW TEXT */}
              <p className="text-sm text-richblack-200 line-clamp-3">
                {review?.review}
              </p>

              {/* RATING */}
              <div className="flex items-center gap-2">
                <span className="text-yellow-100 font-semibold">
                  {review?.rating.toFixed(1)}
                </span>

                <ReactStars
                  count={5}
                  value={review?.rating}
                  size={18}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ReviewSlider
