import moment from "moment";

const Comment = ({ comment }) => {
  const timeAgo = moment(comment.created_at).fromNow();

  return (
    <div className="w-full border border-[#2F3336] p-4 flex gap-3 hover:bg-[#080808]  transition-colors duration-200">
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
        <img
          src={
            comment.user.profil_picture ||
            "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
          }
          alt="user profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 min-w-0 max-w-[calc(100%-30px)]">
            <span className="text-sm font-bold truncate max-w-[120px] sm:max-w-none">
              {comment.user.username}
            </span>
            <span className="text-[#71767B] text-sm truncate flex items-baseline gap-1 max-w-[180px] sm:max-w-none">
              <span className="truncate">{comment.user.email}</span>
              <span>·</span>
              <span className=" hidden sm:block">{timeAgo}</span>
            </span>
          </div>
        </div>

        {/* Comment text */}
        <div className="mt-1  text-[#E7E9EA] text-sm ">
          <p className="text-sm">{comment.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
