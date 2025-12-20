import React from "react";
import Hero from "../../components/Hero";
import FeatureSection from "../../components/FeatureSection";
import HomeMeals from "../../components/MealCard";
import HomeReviews from "../../components/HomeReviews";
import HomeBannerSection from "../../components/HomeBannerSection";

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <FeatureSection></FeatureSection>
      <HomeMeals></HomeMeals>
      <HomeReviews></HomeReviews>
      <HomeBannerSection></HomeBannerSection>
    </div>
  );
};

export default Home;
