import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import useScroll from "../hooks/useScroll";
import { Axios } from "../lib/axios";
import { summaryApi } from "../config/summaryApi";
import {
  resetSelectedTweet,
  setSelectedTweet,
} from "../store/slices/tweet.slice";
import { axiosError } from "../error/axiosError";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { FaRegComment, FaRegHeart, FaHeart } from "react-icons/fa";
import useTweetOptions from "../hooks/useTweetOptions";
import Comment from "./Comment";
import FollowButton from "./FollowButton";

const DEFAULT_PROFILE_IMAGE =
  "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D";
const MAX_COMMENT_LENGTH = 280;

const SelectedTweet = () => {
  const { id } = useParams();
  const { selectedTweet } = useSelector((state) => state.tweet);
  const { user } = useSelector((state) => state.auth);
  const isScrolled = useScroll(20);
  const likedTweet = selectedTweet?.likes?.some((like) => like.id === user.id);
  const bookMark = selectedTweet?.bookmarks?.some((b) => b.id === user.id);
  const { likeTweet, commentTweet, bookMarkTweet } = useTweetOptions();
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTweet = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await Axios({ ...summaryApi.getTweetById(id) });
        if (response.data.success) {
          dispatch(setSelectedTweet(response.data.tweet));
        }
      } catch (error) {
        setError("Failed to load tweet. Please try again.");
        axiosError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTweet();

    return () => {
      dispatch(resetSelectedTweet());
    };
  }, [id, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      await commentTweet(selectedTweet.id, text);
      setText("");
      setError(null);
    } catch (error) {
      setError("Failed to post comment");
    }
  };

  const handleLike = async () => {
    try {
      await likeTweet(selectedTweet.id);
    } catch (error) {
      setError("Failed to like tweet");
    }
  };

  const handleBookmark = async () => {
    try {
      await bookMarkTweet(selectedTweet.id);
    } catch (error) {
      setError("Failed to bookmark tweet");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center my-4">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error && !selectedTweet) {
    return (
      <section>
        <div className="w-full flex items-center gap-4 sticky p-2 top-0">
          <FaArrowLeft
            className="cursor-pointer"
            size={20}
            onClick={() => navigate(-1)}
          />
          <p className="font-bold">Gonderi</p>
        </div>
        <div className="p-4 text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section>
      <div
        className={`w-full flex items-center gap-4 sticky p-2 top-0 ${
          isScrolled ? "backdrop-blur-lg bg-black/40 " : ""
        } transition-all ease-in-out duration-300`}
      >
        <FaArrowLeft
          className="cursor-pointer"
          size={20}
          onClick={() => navigate(-1)}
        />
        <p className="font-bold">Gonderi</p>
      </div>

      {error && (
        <div className="p-2 text-red-500 text-sm text-center">{error}</div>
      )}

      {selectedTweet && (
        <div className="grid p-2 items-start mt-3">
          {/* head */}
          <div className="hidden sm:flex items-center justify-between border-b border-[#2F3336] pb-2 mb-2">
            <div className="flex gap-3">
              <div
                className="max-w-10 w-full h-10 rounded-full overflow-hidden cursor-pointer"
                onClick={() => navigate(`/profile/${selectedTweet.user.id}`)}
              >
                <img
                  src={
                    selectedTweet.user.profil_picture || DEFAULT_PROFILE_IMAGE
                  }
                  alt="userProfile"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold whitespace-nowrap">
                  {selectedTweet.user.username}
                </span>
                <p className="text-[#71767B] text-sm truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {selectedTweet.user.email}
                </p>
              </div>
            </div>
            <div className="block ml-auto">
              <FollowButton id={selectedTweet.user.id} />
            </div>
          </div>

          {/* text */}
          <div>
            <p className="font-medium line-clamp-3">{selectedTweet.text}</p>
          </div>

          {/* image or video */}
          <div className="w-full h-fit rounded overflow-hidden mt-2">
            {selectedTweet.image && (
              <img
                src={selectedTweet.image}
                className="object-cover object-center w-full h-auto rounded-md"
                alt="tweet media"
              />
            )}

            {selectedTweet.video && !selectedTweet.image && (
              <iframe
                className="w-full h-64 rounded-md"
                src={selectedTweet.video}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Tweet video"
              ></iframe>
            )}
          </div>

          {/* tweet options */}
          <div className="w-full flex items-center justify-between mt-2 border-t border-b border-[#2F3336] py-2">
            {/* like and comment */}
            <div className="flex items-center gap-5">
              {/* like */}
              <div className="flex items-center gap-1 text-sm cursor-pointer hover:text-[#1D9BF0] transition-colors">
                {likedTweet ? (
                  <FaHeart
                    onClick={handleLike}
                    size={21}
                    className="text-red-500"
                  />
                ) : (
                  <FaRegHeart onClick={handleLike} size={21} />
                )}
                <span>{selectedTweet.likes.length}</span>
              </div>

              {/* comment */}
              <div className="flex items-center gap-1 text-sm cursor-pointer hover:text-[#1D9BF0] transition-colors">
                <FaRegComment size={21} />
                <span>{selectedTweet.comments.length}</span>
              </div>
            </div>

            {/* mark */}
            <div className="flex items-center gap-1 text-sm cursor-pointer hover:text-[#1D9BF0] transition-colors">
              <Bookmark
                onClick={handleBookmark}
                className={bookMark ? "text-[#1D9BF0]" : ""}
                size={22}
              />
            </div>
          </div>

          {/* send comment */}
          <form
            onSubmit={handleSubmit}
            className="grid py-4 border-b border-[#2F3336]"
          >
            <div className="flex gap-4 w-full">
              <div className="min-w-12 max-w-12 w-full h-12 rounded-full overflow-hidden">
                <img
                  src={user.profil_picture || DEFAULT_PROFILE_IMAGE}
                  alt="userProfile"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="w-full">
                <textarea
                  className="text-gray-200 text p-2 w-full outline-none border rounded border-[#505357] bg-transparent"
                  placeholder="Yanitini Gonder"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  maxLength={MAX_COMMENT_LENGTH}
                />
                <div className="text-right text-sm text-gray-500">
                  {text.length}/{MAX_COMMENT_LENGTH}
                </div>
              </div>
            </div>
            <button
              disabled={!text.trim()}
              className={`w-fit ml-auto mt-3 rounded-full px-4 py-2 font-bold ${
                !text.trim()
                  ? "bg-[#505357] text-black cursor-not-allowed"
                  : "bg-white text-black cursor-pointer hover:bg-gray-200"
              }`}
            >
              Yanitla
            </button>
          </form>

          {/* comments */}
          <div className="grid gap-2 py-3 mt-4 overflow-y-auto ">
            {selectedTweet.comments.length > 0 ? (
              [...selectedTweet?.comments]
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .map((c) => <Comment key={c.id} comment={c} />)
            ) : (
              <p className="text-center text-gray-500">No comments yet</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SelectedTweet;
