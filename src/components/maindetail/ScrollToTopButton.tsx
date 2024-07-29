import { useQuery } from "@tanstack/react-query";

const getScrollPosition = () => {
  return window.pageYOffset;
};

export const ScrollToTopButton: React.FC = () => {
  const { data: scrollPosition } = useQuery({
    queryKey: ["scrollPosition"],
    queryFn: getScrollPosition,
    refetchInterval: 100,
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (scrollPosition === undefined || scrollPosition <= 300) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out z-50"
      aria-label="Scroll to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};
