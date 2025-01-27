import { useReducer } from "react";
import { galleryReducer, initialState } from "../reducers/galleryReducer";

const useGallery = () => {
  const [state, dispatch] = useReducer(galleryReducer, initialState);
  return { state, dispatch };
};

export default useGallery;
