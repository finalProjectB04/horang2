const DetailPagePagination: React.FC<{
  totalPages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}> = ({ totalPages, page, setPage }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      {totalPages > 1 && (
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          prev
        </button>
      )}

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setPage(index + 1)}
          style={{
            fontWeight: page === index + 1 ? "bold" : "normal",
            margin: "0 5px",
          }}
        >
          {index + 1}
        </button>
      ))}
      {totalPages > 1 && (
        <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
          next
        </button>
      )}
    </div>
  );
};

export default DetailPagePagination;
