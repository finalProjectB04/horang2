import { useState } from "react";

const useShowMore = (initialState = false) => {
  const [showMore, setShowMore] = useState(initialState);

  const toggleShowMore = () => {
    setShowMore((prevState) => !prevState);
  };

  return {
    showMore,
    toggleShowMore,
  };
};

export default useShowMore;
