import React from "react";
import Hero from "../../components/Hero";
import FeatureSection from "../../components/FeatureSection";
import HomeMeals from "../../components/MealCard";

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <FeatureSection></FeatureSection>
      <HomeMeals></HomeMeals>
    </div>
  );
};

export default Home;
