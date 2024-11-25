import {createSlice} from '@reduxjs/toolkit'

const initialState = {

    seq:'',
    price:'',

}

const priceSlice = createSlice({


    name:'price',   
    initialState,   
    reducers:{  

        inputAction:(state, action) => {
            state.seq=action.payload.seq;
            state.price=action.payload.price;

            
        },

    }
})


export const {inputAction} = priceSlice.actions;

export default priceSlice;
