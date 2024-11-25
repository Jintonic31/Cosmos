import { Suspense, lazy } from 'react';
const {createBrowserRouter} = require('react-router-dom')


const Loading = <div style={{color:"red"}}><h3>Loading...</h3></div>


const Main = lazy( ()=>import('../Page/Main') )
const JoinAuction = lazy( ()=>import('../Page/JoinAuction') )
const SubStart = lazy( ()=>import('../Page/SubStart') )
const SelectPlanet = lazy( ()=>import('../Page/SelectPlanet') )
const InputMoney = lazy( ()=>import('../Page/InputMoney') )
const LoadingVideo = lazy( ()=>import('../Page/LoadingVideo') )




const root = createBrowserRouter([

    {
        path:'',
        element:<Suspense fallback={Loading}><Main /></Suspense>
    },
    {
        path:'/joinAuction',
        element:<Suspense fallback={Loading}><JoinAuction /></Suspense>
    },
    {
        path:'/substart',
        element:<Suspense fallback={Loading}><SubStart /></Suspense>
    },
    {
        path:'/selectplanet',
        element:<Suspense fallback={Loading}><SelectPlanet /></Suspense>
    },
    {
        path:'/inputmoney',
        element:<Suspense fallback={Loading}><InputMoney /></Suspense>
    },
    {
        path:'/loadingvideo',
        element:<Suspense fallback={Loading}><LoadingVideo /></Suspense>
    },




]);



export default root;