import AutorenewIcon from "@mui/icons-material/Autorenew";

function RefreshBtn({ handleRefresh }) {

  return (
    <button
      onClick={handleRefresh}
      className="bg-denim-100 border border-denim-700 text-denim-700 font-bold py-2 px-4 rounded-md transition-all duration-200 hover:bg-denim-200"
    >
      <AutorenewIcon />
    </button>
  );
}

export default RefreshBtn;
