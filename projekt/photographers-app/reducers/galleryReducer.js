export const initialState = {
    photos: [],
    photoLoadingStates: {},
};

export const galleryReducer = (state, action) => {
    switch (action.type) {
        case "SET_PHOTOS":
            return {
            ...state,
            photos: action.payload,
            photoLoadingStates: {
                ...state.photoLoadingStates,
                ...action.payload.reduce((states, photo) => {
                if (!(photo._id in states)) {
                    states[photo._id] = false;
                }
                return states;
                }, {}),
            },
            };
        case "UPDATE_PHOTO":
            return {
            ...state,
            photos: state.photos.map((photo) =>
                photo._id === action.payload._id ? action.payload : photo
            ),
            };
        case "PHOTO_LOADED":
            return {
            ...state,
            photoLoadingStates: {
                ...state.photoLoadingStates,
                [action.payload]: false, // photo has finished loading
            },
            };
        case "ADD_PHOTO":
            return {
            ...state,
            photos: [...state.photos, action.payload],
            };
        case "DELETE_PHOTO":
            return {
            ...state,
            photos: state.photos.filter((photo) => photo._id !== action.payload),
            };
        default:
            return state;
    }
};