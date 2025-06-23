import React from "react";
// import { SliderSection } from "./SliderSection";
import Header from "../../../general/Header";
import { useGetSlidersByType } from "../../../utils/hooks/query";
import LoadingAnimations from "../../LoadingAnimations";
import { SliderSection } from "./SliderSection2";

const SliderSettings = () => {
  const { data: homeSlidesData, isLoading: isLoadingHome } =
    useGetSlidersByType("home");
  const { data: loginSlidesData, isLoading: isLoadingLogin } =
    useGetSlidersByType("login");
  const { data: careerSlidesData, isLoading: isLoadingCareer } =
    useGetSlidersByType("career");
  const { data: dashSlidedata, isLoading: isLoadingDash } =
    useGetSlidersByType("dashboard");
  const homeSlides = homeSlidesData?.data || [];
  const loginSlides = loginSlidesData?.data || [];
  const careerSlides = careerSlidesData?.data || [];
  const dashSlides = dashSlidedata?.data || [];
  const sample =
    "https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg";
  return (
    <div className="max-w-6xl mx-auto">
      <Header title="Settings" subtitle="Manage settings" history={true} />
      <div className="px-4">
        <div className="p-8 bg-white rounded-4xl">
          {isLoadingHome ? (
            <LoadingAnimations loading={isLoadingHome} />
          ) : (
            <SliderSection
              title="Homepage Slider"
              description="Manage the content on the homepage slider"
              initialSliders={homeSlides}
              sliderType="home"
            />
          )}
          {isLoadingLogin ? (
            <LoadingAnimations loading={isLoadingLogin} />
          ) : (
            <SliderSection
              title="Login Slider"
              description="Manage the content on the login slider"
              initialSliders={loginSlides}
              sliderType="login"
            />
          )}

          {isLoadingDash ? (
            <LoadingAnimations loading={isLoadingDash} />
          ) : (
            <SliderSection
              title="User Dashboard Slider"
              description="Manage the content on the user dashboard slider"
              initialSliders={dashSlides}
              sliderType="dashboard"
            />
          )}
          {isLoadingCareer ? (
            <LoadingAnimations loading={isLoadingCareer} />
          ) : (
            <SliderSection
              title="Career Page Slider"
              description="Manage the content on the user career page slider"
              initialSliders={careerSlides}
              sliderType="career"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SliderSettings;
