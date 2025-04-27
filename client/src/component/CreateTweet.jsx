import { useState, useRef } from "react";
import { CgClose } from "react-icons/cg";
import { GoFileMedia } from "react-icons/go";
import { useSelector } from "react-redux";
import { axiosError } from "../error/axiosError";
import { Axios } from "../lib/axios";
import { summaryApi } from "../config/summaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateTweet = ({ close }) => {
  const [tweetDetails, setTweetDetails] = useState({
    text: "",
    image: null,
    video: null,
  });

  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState({
    image: null,
    video: null,
  });
  const navigate = useNavigate("/");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTweetDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const fileType = file.type.split("/")[0];

    if (tweetDetails.image || tweetDetails.video) {
      if (!window.confirm("Yüklənmiş media silinəcək. Davam edilsin?")) {
        return;
      }
    }

    const previewURL = URL.createObjectURL(file);

    if (fileType === "image") {
      setTweetDetails({
        text: tweetDetails.text,
        image: file,
        video: null,
      });

      setMediaPreview({
        image: previewURL,
        video: null,
      });
    } else if (fileType === "video") {
      setTweetDetails({
        text: tweetDetails.text,
        video: file,
        image: null,
      });
      setMediaPreview({
        video: previewURL,
        image: null,
      });
    }
  };

  const removeMedia = () => {
    if (mediaPreview.image) URL.revokeObjectURL(mediaPreview.image);
    if (mediaPreview.video) URL.revokeObjectURL(mediaPreview.video);

    setTweetDetails({
      ...tweetDetails,
      image: null,
      video: null,
    });
    setMediaPreview({
      image: null,
      video: null,
    });
  };

  const handleSubmit = async () => {
    if (
      !tweetDetails.text.trim() &&
      !tweetDetails.image &&
      !tweetDetails.video
    ) {
      alert("Mətn, şəkil və ya video daxil edin!");
      return;
    }

    const formData = new FormData();
    formData.append("text", tweetDetails.text);

    if (tweetDetails.image) {
      formData.append("image", tweetDetails.image);
    }

    if (tweetDetails.video) {
      formData.append("video", tweetDetails.video);
    }

    setLoading(true);

    try {
      const res = await Axios({ ...summaryApi.createTweet, data: formData });
      console.log(res);
      if (res.data.status === "success") {
        toast.success(res.data.message);
        close();
        navigate("/");
      }
    } catch (error) {
      axiosError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[rgba(36,45,52,0.8)]">
      <div className="bg-black w-full max-w-xl p-5 rounded-xl">
        <div className="flex justify-between items-center">
          <CgClose
            size={20}
            onClick={close}
            className="cursor-pointer text-gray-400 hover:text-white"
          />
        </div>

        <div className="border-b border-[#333639] mt-3">
          <div className="flex gap-3 p-4">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={
                  user.profil_picture ||
                  "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                }
                alt="Profil"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full">
              <textarea
                className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none"
                maxLength={280}
                placeholder="Neler oluyor?"
                rows={4}
                value={tweetDetails.text}
                name="text"
                onChange={handleChange}
              />

              {mediaPreview.image && (
                <div className="relative mt-3 rounded-xl overflow-hidden">
                  <img
                    src={mediaPreview.image}
                    alt="Preview"
                    className="w-full max-h-80 object-contain rounded-xl"
                  />
                  <button
                    onClick={removeMedia}
                    className="absolute top-2 right-2 bg-black/70 rounded-full p-1 hover:bg-black/90"
                  >
                    <CgClose size={18} className="text-white" />
                  </button>
                </div>
              )}

              {mediaPreview.video && (
                <div className="relative mt-3 rounded-xl overflow-hidden">
                  <video
                    src={mediaPreview.video}
                    controls
                    className="w-full max-h-80 rounded-xl"
                  />
                  <button
                    onClick={removeMedia}
                    className="absolute top-2 right-2 bg-black/70 rounded-full p-1 hover:bg-black/90"
                  >
                    <CgClose size={18} className="text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaChange}
              accept="image/*,video/*"
              className="hidden"
            />
            <GoFileMedia
              size={24}
              className="text-[#1D9BF0] cursor-pointer hover:bg-blue-900/10 p-1 rounded-full"
              onClick={() => fileInputRef.current.click()}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              (!tweetDetails.text.trim() &&
                !tweetDetails.image &&
                !tweetDetails.video) ||
              loading
            }
            className={`px-4 py-1.5 rounded-full font-bold ${
              (tweetDetails.text.trim() ||
                tweetDetails.image ||
                tweetDetails.video) &&
              !loading
                ? "bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white"
                : "bg-[#1D9BF0]/50 cursor-not-allowed text-white/50"
            }`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Gönderi yayınla"
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateTweet;
