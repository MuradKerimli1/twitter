import toast from "react-hot-toast";
import { summaryApi } from "../config/summaryApi";
import { axiosError } from "../error/axiosError";
import { Axios } from "../lib/axios";
import { useSelector } from "react-redux";

const FollowButton = ({ id }) => {
  const { user } = useSelector((state) => state.auth);

  const isFollow = user?.following?.some((f) => f.id == id);

  const handleFollow = async (e) => {
    if (e?.stopPropagation) e.stopPropagation();
    if (e?.preventDefault) e.preventDefault();

    try {
      const res = await Axios({ ...summaryApi.followUser(id) });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      axiosError(error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleFollow}
      className={`px-3 py-2 cursor-pointer font-bold text-sm rounded-full border border-[#5F6468] block ml-auto shadow-none transition-all duration-200 ${
        isFollow
          ? "bg-black text-white border border-[#44525C] hover:text-red-500"
          : "bg-[#D7DBDC] text-black hover:bg-[#D7DBDC] border-none"
      }`}
    >
      {isFollow ? "Takibi Bırak" : "Takip Et"}
    </button>
  );
};

export default FollowButton;
