import React, { useState } from 'react'
import './home.css'
import Header from '../../componnents/Header/Header'
import ExploreMenu from '../../componnents/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../componnents/FoodDisplay/FoodDisplay'
import AppDownload from '../../componnents/AppDownload/AppDownload'

const Home = () => {

    const [category, setCategory] = useState("All");

    return (
        <div>
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
            <AppDownload />
        </div>
    )
}

export default Home
