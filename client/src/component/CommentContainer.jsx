import { useDispatch, useSelector } from "react-redux";
import { IoCloseSharp } from "react-icons/io5";
import moment from "moment";
import { useState } from "react";
import useTweetOptions from "../hooks/useTweetOptions";
import { resetSelectedTweet } from "../store/slices/tweet.slice";

const CommentContainer = ({ close }) => {
  const { user } = useSelector((state) => state.auth);
  const { selectedTweet } = useSelector((state) => state.tweet);
  const timeAgo = moment(selectedTweet?.created_at).fromNow();
  const { commentTweet } = useTweetOptions();
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const handleClose = () => {
    close();
    dispatch(resetSelectedTweet());
    setText("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      return;
    }
    commentTweet(selectedTweet.id, text);
    setText("");
    close();
  };

  return (
    <section
      style={{ backgroundColor: "rgba(36, 45, 52, 0.8)" }}
      className="fixed top-0 bottom-0 right-0 left-0 z-50 w-full flex items-center justify-center p-3 "
    >
      <div className="bg-black w-full max-w-xl p-5 rounded-xl overflow-x-hidden">
        <div className=" flex items-end justify-end">
          <IoCloseSharp
            size={26}
            className=" cursor-pointer"
            onClick={() => handleClose()}
          />
        </div>
        {/* main */}
        <div className=" flex gap-3">
          <div className="min-w-12 max-w-12 w-full h-12 rounded-full overflow-hidden">
            <img
              src={
                selectedTweet?.user.profil_picture ||
                "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
              }
              alt="userProfile"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className=" flex flex-col  gap-1">
            <div className=" flex flex-col sm:flex-row sm:gap-2 text-sm overflow-hidden line-clamp-1 ">
              <p>{selectedTweet?.user.username}</p>
              <span className="text-[#505357]">
                {selectedTweet?.user.email} · {timeAgo}
              </span>
            </div>
            <div className=" border-l-2 border-[#505357] p-2">
              <p className=" font-medium line-clamp-4 truncate">
                {selectedTweet?.text}
              </p>
              <p className=" text-sm text-[#1A8CD8]">
                {selectedTweet?.user.email}{" "}
                <span className=" text-[#505357]">
                  {" "}
                  adlı kullanıcıya yanıt olarak
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* comment */}
        <form onSubmit={handleSubmit} className=" grid py-3 mt-4">
          <div className=" flex  gap-4 w-full">
            <div className="min-w-12 max-w-12 w-full h-12 rounded-full overflow-hidden">
              <img
                src={
                  user.profil_picture ||
                  "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                }
                alt="userProfile"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className=" w-full">
              <textarea
                className=" text-gray-200 text-xl p-2 w-full outline-none border rounded border-[#505357]"
                placeholder="Yanitini Gonder"
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>
          </div>
          <button
            disabled={!text}
            className={` w-fit ml-auto mt-3 rounded-full px-4 py-2 font-bold ${
              !text
                ? "bg-[#505357] text-black cursor-not-allowed"
                : " bg-white text-black cursor-pointer"
            }`}
          >
            Yanitla
          </button>
        </form>
      </div>
    </section>
  );
};

export default CommentContainer;
